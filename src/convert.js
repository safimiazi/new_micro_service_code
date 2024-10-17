const data = require("./ConvertedDate.json");
console.log("🚀 ~ data:", data);
const fs = require("fs");

// const ModifyDate = data.map((e) => {
//   return {
//     date: new Date(e["Prospect ID"]).toISOString(),
//     name: e["Prospect Details"],
//     phone: e["Primary Contact"],
//   };
// });

// fs.writeFileSync("./ConvertedDate.json", JSON.stringify(ModifyDate));
