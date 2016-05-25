
suite('amp-playlists', function() {
  var player, videos, index;
  suiteSetup(function(){
    // Init playlistItems
        videos = [
        {
          src : [
            //'http://stream.flowplayer.org/bauhaus/624x260.webm',
            'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4',
            //'http://stream.flowplayer.org/bauhaus/624x260.ogv'
          ],
          poster : 'http://flowplayer.org/media/img/demos/minimalist.jpg',
          title : 'Video 1'
        },
        {
          src : [
            //'http://stream.flowplayer.org/night3/640x360.webm',
            'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4',
            //'http://stream.flowplayer.org/night3/640x360.ogv'
          ],
          poster : 'http://flowplayer.org/media/img/demos/playlist/railway_station.jpg',
          title : 'Video 2'
        },
        {
          src : [
            //'http://stream.flowplayer.org/functional/624x260.webm',
            "http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest",
            //'http://stream.flowplayer.org/functional/624x260.ogv'
          ],
          poster : 'http://flowplayer.org/media/img/demos/functional.jpg',
          title : 'Video 3'
        }
      ];
      var options = {
          autoplay: true,
          controls: true,
          width: "640",
          height: "400",
          poster: ""
      };
    player = amp("example_video_1",options);
    player.playlist(videos);
  });

  suite('#_init()', function(){
    test('should have same videos stored after videos have been loaded',function(){
      assert.equal(player.pl.videos.length,videos.length);
    });
    test('current video should be 0 after init',function(){
      assert.equal(player.pl.current,0);
    });
    test('videos should include at least source',function(){
      assert.equal(player.pl.videos[0].hasOwnProperty("src"),true);
    });
  });
  suite('#playlist(index)',function(){
    suiteSetup(function(){
      index = 1;
      player.playlist(index);
    });
    test('current should change on index passing',function(){
      assert.equal(player.pl.current,index);
    });
    test('poster should match video poster',function(){
      var poster = $('.vjs-poster').css('background-image').replace('url(','').replace(')','').replace(/\"/g,"");
      assert.equal(poster,videos[index].poster);
    });
  });
  suite('general',function(){
    setup(function(){
      index = 0;
      player.playlist(index);
    });
    test('next video should autostart',function(done){
      player.one('loadedmetadata',function(){
        var duration = player.duration();
        console.log(duration);
        player.currentTime(duration);
      });
      player.one('next',function(){
        done();
      });
    });
    test('last video should fire event',function(done){
      player.playlist(1);
      player.one('loadedmetadata',function(){
        var duration = player.duration();
        player.currentTime(duration);
      });
      player.one('lastVideoEnded',function(){
        done();
      });
    });
  });
  suite('#next()',function(){
    setup(function(){
      index = 0;
      player.playlist(index);
    });
    test('calling next increase the current video index',function(done){
      var currentVideo = player.pl.current;
      player.one('next',function(){
        assert.equal(player.pl.current,currentVideo+1);
        done();
      });
      player.next();
    });
    test('calling next should fire a \'next\' event',function(done){
      player.one('next',function(){
        done();
      });
      player.next();
    });
  });

  suite('#prev()',function(){
    setup(function(){
      index = 1;
      player.playlist(index);
    });
    test('calling prev decrease the current video index',function(done){
      var currentVideo = player.pl.current;
      player.one('prev',function(){
        assert.equal(player.pl.current,currentVideo-1);
        done();
      });
      player.prev();
    });
    test('calling prev should fire a \'prev\' event',function(done){
      player.one('prev',function(){
        done();
      });
      player.prev();
    });
  });
});
