import { EmailServices } from "@/service/emailService";

export const EmailControllers  = {
    async sendEmail (req, res){
        const { to, subject, body } = req.body;
        try {
            await EmailServices.sendEmailToQueue({ to, subject, body });
            res.status(200).json({ message: 'Email queued successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to queue email' });
        }
    },
}