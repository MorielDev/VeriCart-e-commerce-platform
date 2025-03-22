import amqp from 'amqplib';

const QUEUE_NAME = 'order_notifications';

const consumeOrders = async () => {
    try {
        const connection = await amqp.connect('amqp://vericart-rabbitmq-1'); // Use the correct service name
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(` Waiting for messages in ${QUEUE_NAME}...`);

        channel.consume(QUEUE_NAME, (msg) => {
            if (msg !== null) {
                const orderData = JSON.parse(msg.content.toString());
                console.log(` Received order notification:`, orderData);
                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error(" Error in order consumer:", error);
    }
};

consumeOrders();
