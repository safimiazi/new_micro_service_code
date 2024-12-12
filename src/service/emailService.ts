import { sendToQueue } from "@/config/rabbitmq";

export const EmailServices = {
    async sendEmailToQueue  (emailData)  {
        await sendToQueue(process.env.EMAIL_QUEUE, emailData);
    },
}