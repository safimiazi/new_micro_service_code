import { db } from "@/database";
import { Markup } from "telegraf";
import { SendMenuAccount, SendMenuStudent } from "../SendMenu";

export const MENU2_action = async (ctx) => {
  try {
    const from = ctx.update?.callback_query.from;
    const command = ctx.match.input.split("_")[1];

    const UserInDb = await db.TelegramUser.findOne({
      where: {
        telegram_user_id: `${from.id}`,
      },
      include: [
        {
          model: db.User,
          as: "user",
        },
      ],
    });
    if (!UserInDb) {
      ctx.reply(
        "You are not verify Please enter your email and password example (example@email.com password):",
        Markup.forceReply()
      );
    }
    switch (command) {
      case "account":
        SendMenuAccount(ctx, UserInDb.toJSON());
        break;
      case "student":
        SendMenuStudent(ctx, UserInDb.toJSON());
        break;
      default:
        ctx.reply("Something went wrong. 🔴", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback("Back", "MENU_menu")],
          ]).reply_markup,
        });
        break;
    }
  } catch (error) {
    console.log("🚀 ~ constMENU_action= ~ error:", error);
    ctx.reply("Something went wrong.");
  }
};
