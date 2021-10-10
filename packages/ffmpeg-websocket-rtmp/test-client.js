var ws = require('websocket-stream')
var test = require('tape')
var Buffer = require('safe-buffer').Buffer

test('echo works', function(t) {
  var stream = ws('ws://localhost:4000', { binary: true })
  stream.on('data', function(o) {
    t.ok(Buffer.isBuffer(o), 'is buffer')
    t.equal(o.toString(), 'hello', 'got hello back')
    stream.destroy()
    t.end()
  })
  stream.write(Buffer.from('hello'))
  stream.write('lolololololololololok')
})
