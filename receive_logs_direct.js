#! /Users/changhee/.nvm/versions/node/v14.15.5/bin node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}
amqp.connect ('amqp://racetrack:racetrack@18.162.209.111:5672/racetrack', function(error0, connection) { 
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'direct_logs';
    channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, (error2, q) => {
      if (error2) {
        throw error2
      }
      console.log(' [x] Waiting for logs. To exit press CTRL+C');
      args.forEach((severity)=> {
        channel.bindQueue(q.queue, exchange, severity);
      });
      channel.consume(q.queue, (msg) => {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      },{
        noAck: true
      });
    });
  });
});