const express = require('express');
const app = express();
const amqp = require('amqplib/callback_api');

const PORT = process.env.PORT || 5000;
const URL = 'amqp://localhost';

// send message
amqp.connect( URL, ( err, conn ) => {
    conn.createChannel( ( err, ch ) => {
        var queueName = 'First_queue';
        var msg = { id: 1, message: 'My Second message'};

        ch.assertQueue(queueName, { durable: false});
        var msgReturn = ch.sendToQueue(queueName, Buffer.from( JSON.stringify( msg )));

        if (msgReturn) {
            console.log( 'Message was sent' );
        }else{
            console.log( 'Error had ocurred' );
        }
    });

    setTimeout(() => {
        conn.close();
        process.exit(0);
    }, 500);
});

//consume message
amqp.connect( URL, ( err, conn ) => {
    conn.createChannel( ( err, ch ) => {
        var queueName = 'First_queue';

        ch.assertQueue(queueName, { durable: false});

        ch.consume(queueName, ( message ) => {
            console.log( message.content.toLocaleString() );
        }, { noAck: true});
})
});


app.listen(
    PORT,
    () => { console.log(`Server running on port ${PORT}`) }
);