import { ExpenseController } from "@/controllers/account/ExpenseController";
import { db } from "@/database";
import { DateFn } from "@/utility/Date/DateFn";
import { Op } from "sequelize";
import { Markup } from "telegraf";

export const Account_Action = async (ctx) => {
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
      case "todayExpenseVsIncome":
        try {
          const Today = new Date();
          const { startDate, endDate } = DateFn.createDateRange(Today);

          const QuData = await db.AccountTransaction.findAll({
            attributes: [
              "type",
              [
                db.sequelize.fn("SUM", db.sequelize.col("amount")),
                "total_amount",
              ],
            ],
            where: {
              [Op.and]: {
                // @ts-ignore
                institute_id: UserInDb.toJSON().user.institute_id,
                createdAt: {
                  [Op.between]: [startDate, endDate],
                },
              },
            },
            group: ["type"],
          });
          const Balance = QuData.map((e) => e.toJSON());

          ctx.reply(
            `<b>🟢 Today Income : ${
              Balance?.filter((e: any) => {
                return e.type === "income";
                // @ts-expect-error skip
              })[0]?.total_amount || 0
            } BDT</b>\n<b>🔴 Today expense : ${
              Balance?.filter((e: any) => {
                return e.type === "expense";
                // @ts-expect-error skip
              })[0]?.total_amount || 0
            } BDT </b>`,
            {
              parse_mode: "HTML",
              reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback("Back", "MENU2_account")],
              ]).reply_markup,
            }
          );
        } catch (error) {
          console.log("🚀 ~ constAccount_Action= ~ error:", error);
          ctx.reply("Something went wrong. 🔴");
        }
        break;
      case "todayIncomeVsExpenseMonth":
        try {
          const Today = new Date();
          const { startDate, endDate } = DateFn.CreateMonthRange(Today);
          const QuData = await db.AccountTransaction.findAll({
            attributes: [
              "type",
              [
                db.sequelize.fn("SUM", db.sequelize.col("amount")),
                "total_amount",
              ],
            ],
            where: {
              [Op.and]: {
                // @ts-ignore
                institute_id: UserInDb.toJSON().user.institute_id,
                createdAt: {
                  [Op.between]: [startDate, endDate],
                },
              },
            },
            group: ["type"],
          });
          const Balance = QuData.map((e) => e.toJSON());

          ctx.reply(
            `<b>🟢 Income This Month : ${
              Balance?.filter((e: any) => {
                return e.type === "income";
                // @ts-expect-error skip
              })[0]?.total_amount || 0
            } BDT</b>\n<b>🔴 Expense This Month : ${
              Balance?.filter((e: any) => {
                return e.type === "expense";
                // @ts-expect-error skip
              })[0]?.total_amount || 0
            } BDT </b>`,
            {
              parse_mode: "HTML",
              reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback("Back", "MENU2_account")],
              ]).reply_markup,
            }
          );
        } catch (error) {
          console.log("🚀 ~ constAccount_Action= ~ error:", error);
          ctx.reply("Something went wrong. 🔴", {
            reply_markup: Markup.inlineKeyboard([
              [Markup.button.callback("Back", "MENU2_account")],
            ]).reply_markup,
          });
        }
        break;
      default:
        ctx.reply("Something went wrong. 🔴", {
          reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback("Back", "MENU2_account")],
          ]).reply_markup,
        });
        break;
    }
  } catch (error) {
    console.log("🚀 ~ constMENU_action= ~ error:", error);
    ctx.reply("Something went wrong.");
  }
};
