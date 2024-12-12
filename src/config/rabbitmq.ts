import amqp from 'amqplib';

let connection;
let channel;

export const connectRabbitMQ = async () => {
    if (connection) return { connection, channel };
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    console.log('RabbitMQ connected');
    return { connection, channel };
};

export const sendToQueue = async (queue, message) => {
    try {
        const { channel } = await connectRabbitMQ();
        console.log("chennel", channel)
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent to queue: ${queue}`);
    } catch (error) {
        console.error('RabbitMQ Error:', error);
    }
};

