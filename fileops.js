const commands = require('child_process');
const fs = require('fs');
const os = require('os');

function FileOps() {
  this.createHtmlFile = function createHtmlFile(content, filename, filepath) {
    const htmlFilePath = `${filepath}${filename}${'.html'}`;
    fs.writeFile(htmlFilePath, content);
    return htmlFilePath;
  };

  this.removeHtmlFile = function removeHtmlFile(htmlfile) {
    return new Promise((resolve, reject) => {
      commands.exec(`rm ${htmlfile}`, (err, stdout) => {
        if (err) reject(err);
        resolve(stdout);
      });
    });
  };

  this.createPdfReadStream = function createPdfReadStream(pdfFilePath) {
    return new Promise((resolve) => {
      // Run interval (1sec) to check if the .pdf file is created
      const interval = setInterval(() => {
        if (fs.existsSync(pdfFilePath)) {
          const readstream = fs.createReadStream(pdfFilePath);
          resolve(readstream);
          clearInterval(interval);
        }
      }, 1000);
    });
  };

  this.createPdfFile = function createPdfFile(chromeCommand) {
    return new Promise((resolve, reject) => {
      commands.exec(chromeCommand.join(' '), (err) => {
        if (err) reject(err);
        resolve('Done');
      });
    });
  };

  this.printHTMLtoPdf = function printHTMLtoPdf(command, pdfFilePath, htmlFilePath, removeflag) {
    return new Promise((resolve, reject) => {
      this.createPdfFile(command).then(() => {
        this.createPdfReadStream(pdfFilePath).then((readstream) => {
          if (removeflag) this.removeHtmlFile(htmlFilePath);
          resolve(readstream);
        }).catch((createError) => { reject(createError); });
      }).catch((readStreamError) => { reject(readStreamError); });
    });
  };
}

module.exports = FileOps;
