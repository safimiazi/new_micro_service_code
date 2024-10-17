import { exec } from "child_process";
import nodemailer from "nodemailer";

import path from "path";
import fs from "fs";
import { ENV } from "@/config/env";
import mysqldump from "mysqldump";

// Function to send email with backup file
const sendBackupEmail = async (backupFilePath: string, error: boolean) => {
  const transporter = nodemailer.createTransport({
    host: ENV.MAIL_HOST,
    port: ENV.MAIL_PORT,
    auth: {
      user: ENV.MAIL_USER,
      pass: ENV.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "backup@dewanit.com",
    to: "ceo@dewanict.com",
    subject: error
      ? " 🔴ERROR DATABASE BACKUP | EDUSYNC🔴"
      : "Edusync Database Backup",
    text: error
      ? "Some Thing Is Wrong In Edusync DataBase"
      : "Please find the attached database backup file.",
    attachments: [
      !error && {
        filename: new Date().toDateString() + "backup.sql",
        path: backupFilePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Backup file sent via email successfully.");
    fs.unlinkSync(backupFilePath); // Remove the file after sending the email
    console.log("Backup file removed after email was sent.");
  } catch (error) {
    console.error("Error sending backup email:", error);
  }
};

// Function to create database backup in a child process
export const createDatabaseBackup = async () => {
  try {
    const backupFilePath = path.join(
      __dirname,
      "mySql",
      `${new Date().toDateString()}backup.sql`
    );
    const dbConfig = {
      host: ENV.DATABASE_HOST,
      user: ENV.DATABASE_USER,
      password: ENV.DATABASE_PASSWORD,
      database: ENV.DATABASE_NAME,
      port: ENV.DATABASE_PORT,
    };
    await mysqldump({
      connection: dbConfig,
      dumpToFile: backupFilePath,
    });
    sendBackupEmail(backupFilePath, false);
  } catch (error) {
    sendBackupEmail("", true);
    console.log("🚀 ~ createDatabaseBackup ~ error:", error);
  }
};

// Schedule the task using cron (Every Friday and Monday at 11 PM)
// cron.schedule("0 23 * * 5,1", () => {
//   console.log(
//     "Scheduled task triggered: Creating and sending database backup."
//   );
// createDatabaseBackup();
// });
