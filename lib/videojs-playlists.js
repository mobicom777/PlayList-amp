
/**
 * Azure Media Player - Playlist Plugin 
 */

/**
**************************************************** 
********************* EXAMPLE **********************
****************************************************
**/

// In order to initialize playlist you need to pass an array of videos with this structure:

////var videos = [
////  {
////    src : [
////      'http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest'
////    ],
////    poster : '',      // Optional
////    title : 'Title1', // Optional
////    timeRange:{       // Optional
////      start : 0,
////      end : 432
////    },
////    token : "bearer eTRsdfsdf12124...." //Optional
////  },
////  {
////    src : [
////    'http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest'
////    ],
////    poster : 'http://www.videojs.com/img/poster.jpg',
////    title : 'Ocean'
////  }
////];


// AMP playlist plugin

(function () {
  // Register AMP Plugin
  amp.plugin('playlist', playList);

  function playList(options,arg){
    var player = this;
    player.pl = player.pl || {};
    var index = parseInt(options,10);

    player.pl._guessVideoType = function(video){
      var videoTypes = {
        'webm'         : 'video/webm',
        'mp4'          : 'video/mp4',
        'ogv'          : 'video/ogg',
        'ism/manifest' : 'application/vnd.ms-sstr+xml'
      };
      
      if(!video){
        return videoTypes.mp4;
      }
      var extension = video.split('.').pop();
      return videoTypes[extension] || '';
    };

    // Init playlist object
    player.pl.init = function(videos, options) {
      options = options || {};
      player.pl.videos = [];
      player.pl.current = 0;
      player.on('ended', player.pl._videoEnd);

      if (options.getVideoSource) {
        player.pl.getVideoSource = options.getVideoSource;
      }

      player.pl._addVideos(videos);
    };
    
    // Update playlist item poster (usefull between sources)
    player.pl._updatePoster = function(posterURL) {
      player.poster(posterURL);
      player.removeChild(player.posterImage);
      player.posterImage = player.addChild("posterImage");
    };

    // Add playlist items to player.pl
    player.pl._addVideos = function(videos){
      for (var i = 0, length = videos.length; i < length; i++){
        var aux = [];
        for (var j = 0, len = videos[i].src.length; j < len; j++){
          var newSource = {
              type : player.pl._guessVideoType(videos[i].src[j]),
              src : videos[i].src[j]
          };

          // Add playlist item token if exists
          if(videos[i].token){
              newSource.protectionInfo = [{
                  type: videos[i].tokenType || "AES", 
                  authenticationToken: videos[i].token
              }];
          }
          aux.push(newSource);
        }
        videos[i].src = aux;
        player.pl.videos.push(videos[i]);
      }
    };

    // Trigger next/prev events
    player.pl._nextPrev = function(func){
      var comparison, addendum;

      if (func === 'next'){
        comparison = player.pl.videos.length -1;
        addendum = 1;
      }
      else {
        comparison = 0;
        addendum = -1;
      }

      if (player.pl.current !== comparison){
        var newIndex = player.pl.current + addendum;
        player.pl._setVideo(newIndex);
        player.trigger(func, [player.pl.videos[newIndex]]);
      }
    };
    
    player.pl._stopPlaylist = function(){
      player.pl.current = 0;
      player.pl.currentVideo = player.pl.videos[0];
      player.pause();
      player.currentTime(0);
      player.trigger('stop');
    };
    // Set item source
    player.pl._setVideo = function(index){
      var currentPlayingSource = player.currentSrc();
      var startPoint = 0;
      if (index < player.pl.videos.length){
        player.pl.current = index;
        player.pl.currentVideo = player.pl.videos[index];

        if (!player.paused()){
          player.pl._resumeVideo();
        }

        // If the current item has the smae source like the prev one
        // We just need to 'jump' and set the current time.
        if(currentPlayingSource  && currentPlayingSource.indexOf(player.pl.currentVideo.src[0].src)!==-1){
             try{
              // Set start opint by item timeRange.start
              if(player.pl.currentVideo.timeRange){
                startPoint = player.pl.currentVideo.timeRange.start;
              }
              setTimeout(function(){
                player.currentTime(startPoint);
              });
               
             } catch(e){}
             
             if(player.paused()){
               // Make sure it runs on other event loop (due to chromium bug)
               setTimeout(function(){
                  player.play();
               },0);
             }
             return;         
        }
      

        if (player.pl.getVideoSource) {

          player.pl.getVideoSource(player.pl.videos[index], function(src, poster) {
            player.pl._setVideoSource(src, poster);
          });
        } else {
          player.pl._setVideoSource(player.pl.videos[index].src, player.pl.videos[index].poster);
        }
      }
    };

    player.pl._setVideoSource = function(src, poster) {
      player.src(src);
      player.pl._updatePoster(poster);
    };

    // Resume play
    player.pl._resumeVideo = function(){
      player.one('loadstart',function(){
        setTimeout(function(){
            player.play();
        },0);
      });
    };

    // Trigger event when video ends
    player.pl._videoEnd = function(){
      if (player.pl.current === player.pl.videos.length -1){
        player.trigger('lastVideoEnded');
      }
      else {
        player.pl._resumeVideo();
        player.next();
      }
    };

    if (options instanceof Array){
      player.pl.init(options, arg);
      player.pl._setVideo(0);
      return player;
    }
    else if (index === index){ // NaN
      player.pl._setVideo(index);
      player.trigger("indexChanged");
      return player;
    }
    else if (typeof options === 'string' && typeof player.pl[options] !== 'undefined'){
      player.pl[options].apply(player);
      return player;
    }
  }

  amp.Player.prototype.next = function(){
    this.pl._nextPrev('next');
    return this;
  };
  amp.Player.prototype.prev = function(){
    this.pl._nextPrev('prev');
    return this;
  };
  amp.Player.prototype.stop = function(){
    this.pl._stopPlaylist();
    return this;
  };

}).call(this); 

