const child_process = require('child_process')
const express = require('express')
const app = express()
const expressWs = require('express-ws')(app, null, {
  perMessageDeflate: false,
})
const websocketStream = require('websocket-stream')
const fs = require('fs')
var streamKey = '0d19-wi38-udkl-jwam' //default, will update by /streamKey with websocket
var ffmpeg

app.use(function (req, res, next) {
  req.testing = 'testing'
  return next()
})

app.get('/', function (req, res, next) {
  //  console.log('get route', req.testing)
  res.end()
})

app.ws('/streamKey', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('streamKey is updated to ', msg)
    streamKey = msg
    ws.send(msg); // feedback for checking and display
    ffmpeg = child_process.spawn(
      'ffmpeg',
      [
        '-v', '0',
        '-i',
        '-',
        '-c:v',
        'libx264',
        '-c:a',
        'aac',
        '-ar',
        '22050',
        '-b:a',
        '22k',
        '-f',
        'flv',
        'rtmp://rtmp.livepeer.com/live/' + streamKey,
      ],
      /*[
        '-f', 'avfoundation', '-framerate', '30', '-pixel_format', 'uyvy422', 
        '-v', '10',
        '-i', '/tmp/x.mp4',
        '-c:v', 'libx264',
        '-tune','zerolatency','-bufsize','5000',
        '-r', '15', 
        '-g','30',
        '-keyint_min','30',
        '-x264opts','keyint=30', 
        '-crf','25',
        '-pix_fmt','yuv420p',
        '-profile:v','baseline',
        '-level','3',
        '-c:a','aac',
        '-ar','22050',
        '-b:a','22k',
        '-f', 'flv',
        'rtmp://rtmp.livepeer.com/live/8128-9mc0-narn-bgwj'
      ]
    */
    )
    
    ffmpeg.stdin.on('error', (e) => {
      console.log('FFmpeg STDIN Error', e)
    })
    
    ffmpeg.stderr.on('data', (data) => {
      console.log('FFmpeg STDERR:', data.toString())
    })
    
    ffmpeg.stderr.on('error', (data) => {
      console.log('FFmpeg STDERR error:', data.toString())
    })
    
    ffmpeg.stdout.on('data', (data) => {
      console.log('FFmpeg STDOUT:', data.toString())
    })
  });
});

app.ws('/', function (ws, req) {
  ws.on('message', function (msg) {
    //console.log(msg)
    ffmpeg.stdin.write(msg)
  })
})
/* testing only
app.ws('/bigdata.json', function (ws, req) {
  // convert ws instance to stream
  const stream = websocketStream(ws, {
    // websocket-stream options here
    binary: true,
  })
  try {
    fs.createReadStream(
      '/Users/mingderwang/src/all/Templates/crl/socket-stream/bigdata.json',
    ).pipe(stream)
  } catch (e) {
    console.log('error', e)
  }
})
*/



app.listen(4000)
