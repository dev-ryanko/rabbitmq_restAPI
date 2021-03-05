#! /Users/changhee/.nvm/versions/node/v14.15.5/bin node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://uguest:pguest@18.162.209.111:5672', function(connectError, connection) {
  if (connectError) {
    throw connectError;
  }
  connection.createChannel(function(channelError, channel) { 
    if (channelError) { 
      throw channelError
    }
    var queue = 'task_queue';

    channel.consume(queue, function(msg) {
      var secs = msg.content.toString().split('.').length -1;
      console.log(' [x] Received %s', msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
      }, secs * 1000);
    }, {
      noAck:false
    })
  })
});
