#! /Users/changhee/.nvm/versions/node/v14.15.5/bin node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2)

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

amqp.connect ('amqp://uguest:pguest@18.162.209.111:5672', function(error0, connection) { 
  if (error0) {
    throw error0
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    channel.assertQueue('rpc_queue1', {
      exclusive:true
    }, (error2, q) => {
      if (error2) { 
        throw error2
      }
      var correlationId = generateUuid();
      var num = parseInt(args[0]);

      console.log(' [x] Requesting fib(%d)', num);

      channel.consume(q.queue, (msg) => {
        if (msg.properties.correlationId == correlationId) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(() => {
            connection.close();
            process.exit(0)
          }, 500)
        }
      },{
        noAck:true
      });

      channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
        correlationId: correlationId,
        replyTo:q.queue
      });
    })
  });
});


function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}