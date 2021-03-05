#! /Users/changhee/.nvm/versions/node/v14.15.5/bin node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://uguest:pguest@18.162.209.111:5672', function(error0, connection) {
  if (error0) {
    throw error0
  }
  connection.createChannel( (error1, channel) => {
    if (error1) {
      throw error1;
    }
    var exchange = 'logs';
    var msg = process.argv.slice(2).join(' ') || 'hello world!';
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });
    channel.publish(exchange, '', Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500)
 });