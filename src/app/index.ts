import { ENV } from "@config/env";
import Express from "express";
import morgan from "morgan";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import cron from "node-cron";

import { stream } from "@utility/logger";
import { db } from "@/database";
import { errorHandler } from "@error";
import { createDatabaseBackup } from "@/database/backup";

const app = Express();

// init the service
app.use(
  morgan(ENV.LOG_FORMAT, {
    stream,
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.use(cors({ origin: ENV.ORIGIN, credentials: true }));
app.use(hpp());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       defaultSrc: [
//         "'self'",
//         "https://images.unsplash.com",
//         "http://192.168.5.76:5173",
//         "http://127.0.0.1:5173",
//         "http://127.0.0.1:3000",
//         "http://192.168.5.76:5055",
//         "https://192.168.5.76:5055",
//       ],
//       scriptSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "'unsafe-eval'",
//         "https://example.com",
//         "https://images.unsplash.com",
//         "http://192.168.5.76:5173",
//         "http://127.0.0.1:5173",
//         "http://127.0.0.1:3000",
//         "http://192.168.5.76:5055",
//         "https://192.168.5.76:5055",
//       ],
//       // Add 'blob:' to allow the blob scheme
//       objectSrc: [
//         "'none'",
//         "http://192.168.5.76:5173/",
//         "http://127.0.0.1:5173",
//         "http://127.0.0.1:3000",
//         "http://192.168.5.76:5055",
//         "https://192.168.5.76:5055",
//       ],
//       imgSrc: [
//         "'self'",
//         "data:",
//         "blob:",
//         "https://images.unsplash.com",
//         "http://192.168.5.76:5173/",
//         "http://127.0.0.1:5173",
//         "http://127.0.0.1:3000",
//         "http://192.168.5.76:5055",
//         "https://192.168.5.76:5055",
//       ], // Allow blob: for images
//       styleSrc: ["'self'", "'unsafe-inline'"],
//     },
//   })
// );


app.use(compression());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(Express.static(path.join(__dirname, "../public")));

// Schedule the task using cron (Every Friday and Monday at 11 PM)
cron.schedule("0 1 * * *", () => {
  console.log(
    "Scheduled task triggered: Creating and sending database backup."
  );
  createDatabaseBackup();
});

//Sync database
db.sequelize.sync({ alter: false, force: false });

const InitRouters = async () => {
  let functionsFolderPath = path.join(__dirname, "../", "routers");
  
  try {
    // Read all files in the folder
    const files = await fs.readdirSync(functionsFolderPath);
    for (const file of files) {
      const filePath = path.join(functionsFolderPath, file);
      if (
        path.extname(filePath) === ".js" ||
        path.extname(filePath) === ".ts"
      ) {
        // Dynamically import and create Router
        const Module = await import(filePath);
        app.use(Module.default.router);
      }
    }

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../public", "index.html"));
    });
    app.use(errorHandler);
  } catch (error) {
    console.log("🚀 ~ InitRouters ~ error:", error);
  }
};
InitRouters();



export default app;
