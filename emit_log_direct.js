#! /Users/changhee/.nvm/versions/node/v14.15.5/bin node

var amqp = require('amqplib/callback_api');

amqp.connect ('amqp://racetrack:racetrack@18.162.209.111:5672/racetrack', function(error0, connection) { 
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'direct_logs';
    var args = process.argv.slice(2);
    var msg = args.slice(1).join(' ') || 'Hello!';
    var serverity = (args.length > 0) ? args[0]: 'info';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });
    channel.publish(exchange, serverity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", serverity, msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
})
