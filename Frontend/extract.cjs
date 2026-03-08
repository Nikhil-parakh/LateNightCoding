const fs = require("fs");
const path = require("path");

const folderPath = "./src";
const outputFile = "all_code.txt";

function readFiles(dir) {
  let files = fs.readdirSync(dir);

  files.forEach((file) => {
    let fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      readFiles(fullPath);
    } else {
      // only include code files
      if (
        fullPath.endsWith(".js") ||
        fullPath.endsWith(".jsx") ||
        fullPath.endsWith(".css")
      ) {
        const content = fs.readFileSync(fullPath, "utf8");

        fs.appendFileSync(
          outputFile,
          `\n\n===== FILE: ${fullPath} =====\n\n${content}`,
        );
      }
    }
  });
}

readFiles(folderPath);
console.log("All code extracted!");
