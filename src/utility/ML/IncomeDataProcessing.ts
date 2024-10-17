interface Transaction {
  date: string;
  total_income: number;
  total_expense: number;
}

function convertDateString(dateString: string): string {
  // Split the input date string
  const [month, day, year] = dateString.split("/");

  // Create a new Date object
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  // Format the date parts
  const formattedYear = date.getFullYear();
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const formattedDay = String(date.getDate()).padStart(2, "0");

  // Return the formatted date string
  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}

export function fillMonthData(
  transactions: Transaction[],
  inputDate: Date
): Transaction[] {
  const { startDate, endDate } = getMonthStartAndEndDates(inputDate);
  const dateMap: { [key: string]: Transaction } = {};

  // Map existing transactions by date for easy lookup
  transactions.forEach((transaction) => {
    dateMap[transaction.date] = transaction;
  });

  const result: Transaction[] = [];
  const currentDate = new Date(startDate);

  // Iterate through each day of the month
  while (currentDate <= new Date()) {
    const dateStr = convertDateString(currentDate.toLocaleDateString()); // Format date as 'YYYY-MM-DD'

    if (dateMap[dateStr]) {
      result.push(dateMap[dateStr]);
    } else {
      result.push({
        date: dateStr,
        total_income: 0,
        total_expense: 0,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

function getMonthStartAndEndDates(inputDate: Date): {
  startDate: Date;
  endDate: Date;
} {
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth();

  // Start date is the first day of the month
  const startDate = new Date(year, month, 1);

  // End date is the last day of the month
  const endDate = new Date(year, month + 1, 0);

  return { startDate, endDate };
}

export function getNext7Days(): string[] {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const next7Days = [];

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    const formattedDate = nextDay.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"
    next7Days.push(formattedDate);
  }

  return next7Days;
}
