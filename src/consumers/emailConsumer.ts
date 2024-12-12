import { connectRabbitMQ } from "@/config/rabbitmq";
import { RedisService } from "@/service/redisService";
import { sendEmail } from "@/utility/emailSender";

export const startConsumer = async () => {
    try {
        const { channel } = await connectRabbitMQ();
        await channel.assertQueue(process.env.EMAIL_QUEUE, { durable: true });

        console.log('Email consumer started');

        channel.consume(process.env.EMAIL_QUEUE, async (msg) => {
            if (msg) {
                const emailData = JSON.parse(msg.content.toString());
                console.log('Processing email:', emailData);

                // Send the email
                const emailId = new Date().getTime();
                await sendEmail(emailData);

                // Log email to Redis
                await RedisService.logEmail(emailId, emailData);

                // Acknowledge the message
                channel.ack(msg);
                
            }
        });
    } catch (error) {
        console.error('Email Consumer Error:', error);
    }
};

