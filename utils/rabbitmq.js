import amqp from 'amqplib';

let channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://vericart-rabbitmq-1'); // Use the correct service name
        channel = await connection.createChannel();
        await channel.assertQueue('order_notifications', { durable: true });
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error(" RabbitMQ Connection Error:", error);
    }
};

export const publishToQueue = async (queue, message) => {
    if (!channel) {
        console.error(" RabbitMQ Channel is not initialized");
        return;
    }
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(` Message sent to ${queue}:`, message);
};
