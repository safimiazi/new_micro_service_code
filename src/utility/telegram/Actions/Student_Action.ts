import { db } from "@/database";
import { DateFn } from "@/utility/Date/DateFn";
import { Op } from "sequelize";
import { Markup } from "telegraf";

export const Student_Action = async (ctx) => {
  try {
    const from = ctx.update?.callback_query.from;

    await ctx.telegram.deleteMessage(
      ctx.update.callback_query?.message.chat.id,
      ctx.update.callback_query?.message.message_id
    );
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
    // routing start
    switch (command) {
      case "todayAdmission":
        try {
          const Today = new Date();
          const { startDate, endDate } = DateFn.createDateRange(Today);

          const Report = await db.student.count({
            where: {
              [Op.and]: {
                // @ts-ignore
                institute_id: UserInDb.toJSON().user.institute_id,
                createdAt: {
                  [Op.between]: [startDate, endDate],
                },
              },
            },
          });

          ctx.reply(" 👨‍🎓 Today Student admission: " + Report, {
            reply_markup: Markup.inlineKeyboard([
              [Markup.button.callback("Back", "MENU2_student")],
            ]).reply_markup,
          });
        } catch (error) {
          console.log("🚀 ~ constStudent_Action= ~ error:", error);
          ctx.reply("Something is Wrong 🔴", {
            reply_markup: Markup.inlineKeyboard([
              [Markup.button.callback("Back", "MENU2_student")],
            ]).reply_markup,
          });
        }
        break;
      case "todayVisitor":
        try {
          const Today = new Date();
          const { startDate, endDate } = DateFn.createDateRange(Today);
          const Report = await db.Visitor.count({
            where: {
              [Op.and]: {
                // @ts-ignore
                institute_id: UserInDb.toJSON().user.institute_id,
                createdAt: {
                  [Op.between]: [startDate, endDate],
                },
              },
            },
          });
          ctx.reply("💁‍♀️ Today Visitor: " + Report, {
            reply_markup: Markup.inlineKeyboard([
              [Markup.button.callback("Back", "MENU2_student")],
            ]).reply_markup,
          });
        } catch (error) {
          console.log("🚀 ~ constStudent_Action= ~ error:", error);
          ctx.reply("Something is Wrong 🔴", {
            reply_markup: Markup.inlineKeyboard([
              [Markup.button.callback("Back", "MENU2_student")],
            ]).reply_markup,
          });
        }
        break;
      default:
        ctx.reply("Something went wrong. 🔴", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback("Back", "MENU2_student")],
          ]).reply_markup,
        });
        break;
    }
  } catch (error) {
    console.log("🚀 ~ constMENU_action= ~ error:", error);
    ctx.reply("Something went wrong. 🔴", {
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.callback("Back", "MENU2_student")],
      ]).reply_markup,
    });
  }
};
