#AMP Playlist plugin

Playlists for Azure Media Player.
Based on videojs plugin https://github.com/jgallen23/videojs-playLists 

##Installation

###Bower

`bower install amp-playlists` TBD

###Manual Download

- [Development]()
- [Production]()

##Usage

### Initialize playList

In order to initialize `playList` you need to pass an array of videos with this structure:

```js
videos = [
  {
    
    // Playlist item source object, can contain 1:n source types of the supported video file types
    src : [
      '//example/path/to/myVideo.ism/manifest',
      '//example/path/to/myVideo.webm',
      '//example/path/to/myVideo.mp4',
      '//example/path/to/myVideo.ogv'
    ],
    poster : '',
    title : 'Video 1',
    
    // Optional token
    token:"Bearer=urn%3amicrosoft%3aazure%3amediaservices%3acontentkeyidentifier=8130520b-c116-45a9-824e-4a0082f3cb3c&Audience=urn%3atest&ExpiresOn=1450207516&Issuer=http%3a%2f%2ftestacs.com%2f&HMACSHA256=eV7HDgZ9msp9H9bnEPGN91sBdU7XsZ9OyB6VgFhKBAU%3d",
    
    // Optional tokenType
    tokenType:"AES",
    
    // Optional timeRange 
    timeRange:{
      start:0, //sec
      end:30
    }
     
},
  {
    src : [
      '//example/path/to/myVideo.ism/manifest',
    ],
    poster : 'http://www.videojs.com/img/poster.jpg',
    title : 'Video 2'
  }
];
```

Now, when videos plays they automatically jump to the next one. You also gain a couple of methods

### Jump to video

Use `player.playList(index)` to jump to a video into the playlist.

### next

AMP receives a `next()` function which put in place the next video.

### prev

AMP receives a `prev()` function which put in place the previous video.

### stop

AMP recieves a `stop()` function which stops the playlist, and resets it (set the player to the first item in playlist)

### Events

<table border="0" cellspacing="5" cellpadding="5">
  <tr><th>Name</th><th>Description</th></tr>
  <tr><td>next</td><td>Fired when you use the `next()` function or when one video finish and the next starts.</td></tr>
  <tr><td>prev</td><td>Fired when you use the `prev()` function.</td></tr>
  <tr><td>lastVideoEnded</td><td>Fired when the playlist has finished.</td></tr>
</table>

A [demo](http://belelros.github.io/videojs-playLists/) is now available to showcase what you can create with this plugin.

##Pending

Pass video parameter to `next` and `prev` events. That should need to rewrite the trigger function from videojs since
doesn't allow passing events.

As a workaround, the `player.pl.current` is updated with the actual index and `player.pl.currentVideo` contains the
video object.

##Development

###Requirements

- node and npm
- bower `npm install -g bower`
- grunt `npm install -g grunt-cli`

###Setup

- `npm install`
- `bower install`

###Run

`grunt dev`

or for just running tests on file changes:

`grunt ci`

###Tests

`grunt mocha`
