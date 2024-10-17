import { ExpenseController } from "@/controllers/account/ExpenseController";
import { db } from "@/database";
import { Markup } from "telegraf";

export const EXPENSE_ACTION = async (ctx) => {
  try {
    const from = ctx.update?.callback_query.from;

    const command = ctx.match.input.split("_")[1];
    const id = ctx.match.input.split("_")[2];

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
      case "approve":
        // approve the expense
        try {
          const ApproveRes = await ExpenseController.ApproveExpenseFromService(
            // @ts-expect-error skip
            UserInDb.toJSON().user,
            id
          );

          ctx.reply(
            `<b>🆗 Expense Request Approve 🆗</b>\n<b>Remaining Balance : </b><i>${ApproveRes.balance} BDT</i>\n<b>Account Name:</b><i>${ApproveRes.account_name}</i>`,
            {
              parse_mode: "html",
              // reply_markup: Markup.inlineKeyboard([
              //   Markup.callbackButton("Back", "back"),
              // ]),
            }
          );
          await ctx.telegram.deleteMessage(
            ctx.update.callback_query?.message.chat.id,
            ctx.update.callback_query?.message.message_id
          );
        } catch (error) {
          if (error?.message) {
            if (error?.message === "Expense Request Not Found!") {
              await ctx.telegram.deleteMessage(
                ctx.update.callback_query?.message.chat.id,
                ctx.update.callback_query?.message.message_id
              );
            }
            return ctx.reply(error?.message);
          }
          console.log("🚀 ~ constEXPENSE_ACTION TEL= ~ error:", error?.message);
        }

        break;
      case "reject":
        // reject expense
        try {
          const ApproveRes = await ExpenseController.DeleteRequestFromService(
            // @ts-expect-error skip
            UserInDb.toJSON().user,
            id
          );
          ctx.reply(" ❌ Reject Request Successfully !");

          await ctx.telegram.deleteMessage(
            ctx.update.callback_query?.message.chat.id,
            ctx.update.callback_query?.message.message_id
          );
        } catch (error) {
          console.log("🚀 ~ constEXPENSE_ACTION reject= ~ error:", error);
          if (error?.message) {
            if (error?.message === "Expense Not Found!") {
              await ctx.telegram.deleteMessage(
                ctx.update.callback_query?.message.chat.id,
                ctx.update.callback_query?.message.message_id
              );
            }
            return ctx.reply(error?.message);
          }

          ctx.reply("Something is Wrong !");
        }
        break;
      default:
        ctx.reply(command + ", ID: " + id);
        break;
    }
  } catch (error) {
    console.log("🚀 ~ constEXPENSE_ACTION= ~ error:", error);
    if (error?.message) {
      return ctx.reply(error?.message);
    }
    ctx.reply("Something went wrong.");
  }
};
