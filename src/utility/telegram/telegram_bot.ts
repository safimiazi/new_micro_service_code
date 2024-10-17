import { configureEnv } from "@/config/env";
import { db } from "@/database";
import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { forceReply } from "telegraf/typings/markup";
import { compare } from "../encryption";
import { SendMenuOne } from "./SendMenu";
import { MENU_action } from "./Actions/MENU_actions";
import { MENU2_action } from "./Actions/MENU2_actions";
import { EXPENSE_ACTION } from "./Actions/EXPENSE-ACTION";
import { Account_Action } from "./Actions/Account_action";
import { Student_Action } from "./Actions/Student_Action";
import Jimp from "jimp";
import QRCodeReader from "qrcode-reader";

export const bot = new Telegraf(configureEnv().TELEGRAM_API);
function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

export const InitTelegramBot = async () => {
  try {
    //
    bot.telegram.setMyCommands([
      { command: "/start", description: "Start interacting with the bot" },
      { command: "/help", description: "Get help using the bot" },
      { command: "/menu", description: "Show the main menu" },
      { command: "/info", description: "Get information about the bot" },
    ]);

    bot.on(message("text"), async (ctx) => {
      // check if user already in database
      try {
        const TelegramUserId = ctx.update?.message?.from.id;
        const message = ctx.update.message;

        const User = await db.TelegramUser.findOne({
          where: {
            telegram_user_id: TelegramUserId,
          },
          include: [
            {
              model: db.User,
              as: "user",
            },
          ],
        });

        if (User) {
          SendMenuOne(ctx, User);
        } else {
          ctx.replyWithPhoto(
            "https://edusync.dewanit.com/graphics/telegram_login.jpg",
            {
              caption:
                "🔴 You Are Not Login ! 🔴\nPlease Login To The Dashboard And Go to profile And Send The Telegrame Connect QR code to me! ",
            }
          );
          ctx.sendInvoice;
          // ctx.reply("Welcome! Please take a photo to continue.", {
          //   reply_markup: {
          //     keyboard: [
          //       [
          //         {
          //           text: "📷 Take Photo",
          //           request_contact: false,
          //           request_location: false,
          //         },
          //       ],
          //     ],
          //     one_time_keyboard: true,
          //     resize_keyboard: true,
          //   },
          // });
        }
      } catch (error) {
        console.log("🚀 ~ bot.on ~ error:", error);
        ctx.reply("something wrong in server");
      }
    });

    //

    // Handle images sent by the user
    bot.on("photo", async (ctx) => {
      try {
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const fileUrl = await ctx.telegram.getFileLink(fileId);
        const message = ctx.message;
        const image = await Jimp.read(fileUrl.href); // Await the Jimp.read operation
        const qr = new QRCodeReader();

        // Promisify the QR code reading
        const qrResult = await new Promise<string | null>((resolve, reject) => {
          qr.callback = (err, value) => {
            if (err || !value) {
              resolve(null);
            } else {
              resolve(value.result);
            }
          };
          qr.decode(image.bitmap);
        });

        console.log("🚀 ~ qrResult ~ qrResult:", qrResult);

        if (qrResult && isValidJson(qrResult)) {
          // login validation
          const { email, code } = JSON.parse(qrResult);
          if (!email || !code) {
            await ctx.reply("Please send a valid QR code.");

            return;
          }
          // make user login
          const UserInDB = await db.User.unscoped().findOne({
            where: {
              email: email,
            },
          });

          if (!UserInDB) {
            ctx.reply("Not Valid Code");
            return;
          }
          // password check
          const Mach = code === UserInDB.toJSON().telegram_pass;

          if (Mach) {
            const EmailExist = await db.TelegramUser.findOne({
              where: {
                user_name: UserInDB.toJSON().email,
              },
            });

            if (EmailExist) {
              await EmailExist.destroy();
            }

            await db.TelegramUser.create({
              first_name: message.from.first_name,
              last_name: message.from.last_name,
              is_bot: message.from.is_bot,
              status: "active",
              user_name: UserInDB.toJSON().email,
              telegram_user_id: `${message.from.id}`,
              user_id: UserInDB.id,
              chat_id: `${message.chat.id}`,
            });

            ctx.replyWithPhoto(
              "https://edusync.dewanit.com/graphics/telegram_login_s.jpg",
              {
                caption: ` 🟢 Welcome ${
                  UserInDB.toJSON().name
                } 🟢\nYou are Successfully Login 🎉`,
              }
            );
          } else {
            await ctx.reply("🔴 Sorry, send me a valid QR code !");
          }
        } else {
          await ctx.reply("🔴 Sorry, send me a valid QR code .");
        }
      } catch (error) {
        console.log("🚀 ~ bot.on ~ error:", error);
        ctx.replyWithPhoto(
          "https://edusync.dewanit.com/graphics/telegram_login.jpg",
          {
            caption: "Failed to process the image.",
          }
        );
      }
    });

    bot.action(/^MENU_/, MENU_action);
    bot.action(/^MENU2_/, MENU2_action);
    bot.action(/^EXPENSE-ACTION_/, EXPENSE_ACTION);
    bot.action(/^AccountReport_/, Account_Action);
    bot.action(/^StudentReport_/, Student_Action);

    // telegram

    bot.launch();
    // Enable graceful stop
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
    console.log("telegram bot initial \n ");
  } catch (error) {
    console.log("🚀 ~ InitTelegramBot ~ error:", error);
  }
};
