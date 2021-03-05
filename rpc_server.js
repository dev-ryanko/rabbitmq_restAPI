#! /Users/changhee/.nvm/versions/node/v14.15.5/bin node

var amqp = require('amqplib/callback_api');


amqp.connect ('amqp://uguest:pguest@18.162.209.111:5672', function(error0, connection) { 
  if (error0) {
    throw error0
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    var queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(" [x] Awaiting RPC requests");
    channel.consume(queue, function reply(msg) {
      var n = parseInt(msg.content.toString());
      console.log(" [.] fib(%d)", n);
      var r = fibonacci(n);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
        correlationId: msg.properties.correlationId
      });
      channel.ack(msg);
    })
  });
});


function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}
