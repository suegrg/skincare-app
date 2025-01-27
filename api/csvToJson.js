const csvtojson = require("csvtojson");
const fs = require("fs");

const csvFilePath = "./skincare_products_clean.csv.xls"; 

csvtojson()
  .fromFile(csvFilePath)
  .then((jsonData) => {
    fs.writeFileSync(
      "./output.json",
      JSON.stringify(jsonData, null, 2),
      "utf-8"
    );
    console.log(
      "CSV to JSON conversion successful. The output is in output.json"
    );
  })
  .catch((error) => {
    console.error("Error converting CSV to JSON:", error);
  });

// run the script with node csvToJson.js