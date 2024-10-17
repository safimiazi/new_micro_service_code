export const DateFn = {
  // Function to create the date range
  createDateRange(date: Date): { startDate: Date; endDate: Date } {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
      throw new Error(
        "⛔ Error in DateFn.ts > path = School_api_dict>src>utility>Date>DateFn.ts : line = 6; Invalid date object"
      );
    }

    // Create start date at 12:00 AM
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    // Create end date at 11:59 PM
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  },
  CreateMonthRange(inputDate: Date): { startDate: Date; endDate: Date } {
    // console.log("🚀 ~ CreateMonthRange ~ inputDate:", inputDate);
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth();
    // Start date is the first day of the month
    const startDate = this.createDateRange(new Date(year, month, 1)).startDate;
    // End date is the last day of the month
    const endDate = this.createDateRange(new Date(year, month + 1, 0)).endDate;
    return { startDate, endDate };
  },
  // Function to get the day of the week as a string
  getDayOfWeek(date) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const givenDate = new Date(date);
    return daysOfWeek[givenDate.getDay()];
  },
};
