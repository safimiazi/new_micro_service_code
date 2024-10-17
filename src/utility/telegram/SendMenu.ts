import { Markup } from "telegraf";

export const SendMenuOne = async (ctx, User) => {
  await ctx.reply(
    `Hi ${User.toJSON().user.name}, How Can I help You? :`,
    Markup.inlineKeyboard([
      [Markup.button.callback("Menu", "MENU_menu")],
      [Markup.button.callback("ME ?", "MENU_me")],
      [Markup.button.callback("Logout", "MENU_logout")],
    ])
  );
};

export const SendMenuTwo = async (ctx, User) => {
  await ctx.telegram.deleteMessage(
    ctx.update.callback_query?.message.chat.id,
    ctx.update.callback_query?.message.message_id
  );
  ctx.reply(
    `Select From A Menu :`,
    Markup.inlineKeyboard([
      [Markup.button.callback("Account", "MENU2_account")],
      [Markup.button.callback("Student", "MENU2_student")],
    ])
  );
};

export const SendMenuAccount = async (ctx, User) => {
  await ctx.telegram.deleteMessage(
    ctx.update.callback_query?.message.chat.id,
    ctx.update.callback_query?.message.message_id
  );
  ctx.reply(
    `Select From A Menu :`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "Expense VS Income Today",
          "AccountReport_todayExpenseVsIncome"
        ),
      ],
      [
        Markup.button.callback(
          "Expense VS Income Month",
          "AccountReport_todayIncomeVsExpenseMonth"
        ),
      ],

      [Markup.button.callback("Back to Menu", "MENU_menu")],
    ])
  );
};

export const SendMenuStudent = async (ctx, User) => {
  await ctx.telegram.deleteMessage(
    ctx.update.callback_query?.message.chat.id,
    ctx.update.callback_query?.message.message_id
  );

  ctx.reply(
    `Select From A Menu :`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "Student Admit Today",
          "StudentReport_todayAdmission"
        ),
      ],
      [Markup.button.callback("Visitor Today", "StudentReport_todayVisitor")],

      [Markup.button.callback("Back to Menu", "MENU_menu")],
    ])
  );
};
