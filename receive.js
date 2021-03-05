#! /Users/changhee/.nvm/versions/node/v14.15.5/bin node

var amqp = require('amqplib/callback_api');

amqp.connect ('amqp://uguest:pguest@18.162.209.111:5672', function(error0, connection) { 
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) { 
    if (error1) { 
      throw error1;
    }
    var queue = 'hello';
    channel.assertQueue(queue, {
      durable: false
    });
    console.log(' [*] Waiting for message in %s, To exit presss CTRL+C', queue);
    channel.consume(queue, (msg) => {
      console.log(" [x] Receive %s", msg.content.toString());
    },{
      noAck : true
    });
  });
});