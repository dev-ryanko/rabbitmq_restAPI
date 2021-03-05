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
    var exchange = 'topic_logs';
    var args = process.argv.slice(2);
    var key = (args.length> 0) ? args[0]: 'Anonymous info';
    var msg = args.slice(1).join(' ') || 'hello world';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", key, msg);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0)
  },500);
})