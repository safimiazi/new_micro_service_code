import { db } from "@/database";
import { SendMenuTwo } from "../SendMenu";

export const MENU_action = async (ctx) => {
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

    switch (command) {
      case "logout":
        await db.TelegramUser.destroy({
          where: {
            telegram_user_id: `${from.id}`,
          },
        });
        ctx.reply("You are logout successfully.");
        break;
      case "me":
        ctx.replyWithPhoto(
          "https://edusync.dewanit.com/graphics/loginBan2.jpg",
          {
            // @ts-expect-error skip
            caption: `Hello, ${UserInDb.user?.name}!`,
          }
        );

        break;
      case "menu":
        SendMenuTwo(ctx, UserInDb);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log("🚀 ~ constMENU_action= ~ error:", error);
    ctx.reply("Something went wrong.");
  }
};
