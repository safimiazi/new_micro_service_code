
const emailRejectTemplate = (name : string) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Email Design</title>
 <style>
     body {
         font-family: Arial, sans-serif;
         background-color: #f4f4f4;
         margin: 0;
         padding: 0;
         display: flex;
         justify-content: center;
         align-items: center;
         height: 100vh;
     }
     .email-container {
         background-color: #fff;
         max-width: 600px;
         border: 1px solid #ddd;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
         padding: 20px;
         border-radius: 8px;
     }
     .email-logo {
         text-align: center;
     }
     .email-logo img {
         width: 60px;
     }
     .email-header {
         color: #ef4444;
         font-size: 20px;
         text-align: center;
         margin-top: 10px;
     }
     .email-body {
         font-size: 16px;
         color: #333;
         margin-top: 20px;
         line-height: 1.6;
     }
     .email-body a {
         color: #ef4444;
         text-decoration: none;
     }
     .email-footer {
         font-size: 14px;
         color: #999;
         margin-top: 20px;
         text-align: center;
     }
     .email-otp {
         padding: 4px 10px;
         border-radius: 5px;
         border: 1px solid gainsboro;
         cursor: pointer;
         color: #ef4444;
         
     }
     .url {
         padding: 4px 10px;
         border-radius: 5px;
         border: 1px solid gainsboro;
         cursor: pointer;
         color: #ef4444;
     }
 </style>
</head>
<body>
 <div class="email-container">
     <div class="email-logo">
         <img src="" alt="Astha Trip Logo">
     </div>
     <div class="email-header">
         Astha Trip
     </div>
     <div class="email-body">
         <p>Hi ${name},</p>
         <p>We are sorry to inform you that your application to create an agency account with Astha Trip has been declined.</p>
         <p>If you have any questions or believe this was a mistake, please reach out to our support team for further assistance.</p>
         <p>Thank you for your interest in working with us.<br>
         Best Regards,<br>
         The Astha Trip Team</p>
     </div>
     <div class="email-footer">
         Mirpur-1, Dhaka<br>
         © 2024 Astha Trip.
     </div>
</div>
 
</body>
</html>
 `;
};

export default emailRejectTemplate;