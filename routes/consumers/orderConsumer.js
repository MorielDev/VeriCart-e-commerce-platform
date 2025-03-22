import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

const consumeOrders = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue('order_notifications', { durable: true });

        console.log('Waiting for messages in order_notifications queue...');

        channel.consume('order_notifications', (msg) => {
            const order = JSON.parse(msg.content.toString());
            console.log('Processing Order:', order);
            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
};

export { consumeOrders };
