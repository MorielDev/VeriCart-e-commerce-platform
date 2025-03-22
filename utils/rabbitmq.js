import amqp from 'amqplib';

let channel;

export const connectRabbitMQ = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            const amqpUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@vericart-rabbitmq-1:5672";
            console.log("🔍 Attempting to connect to RabbitMQ at:", amqpUrl);
            const connection = await amqp.connect(amqpUrl);
            channel = await connection.createChannel();
            await channel.assertQueue('order_notifications', { durable: true });
            console.log("Connected to RabbitMQ");
            return; // Exit the function on success
        } catch (error) {
            retries--;
            console.error(` RabbitMQ Connection Error (${retries} retries left):`, error);
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
    }
    throw new Error("Failed to connect to RabbitMQ after multiple retries");
};

export const publishToQueue = async (queue, message) => {
    if (!channel) {
        console.error(" RabbitMQ Channel is not initialized");
        return;
    }
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(` Message sent to ${queue}:`, message);
};