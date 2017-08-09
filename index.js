"use strict"
const fs = require('fs');
const os = require('os');
const binaryFinder = require('./binary_finder.js');
const { exec } = require('child_process');

const self = module.exports = {

  createHtmlFile: function(bodyHtml, filename) {
      const htmlFilePath = os.tmpdir() + '/' + filename + '.html';

      fs.writeFile(htmlFilePath, bodyHtml, function(err) {
          if(err) {
            console.error('Error creating .html file: ', err);
            return;
          }
        });

        console.log('HTML file created!');
        return htmlFilePath;
  },

  convertMailBodyToPdf: function(bodyHtml, filename, chromeBinary = '\0', outputPath = os.tmpdir() + '/') {
      return new Promise(function (resolve, reject) {
          const pdfFilePath   = outputPath + filename + '.pdf',
              htmlFilePath = 'file://' + self.createHtmlFile(bodyHtml, filename);
          var CLI_ARGS = [
              '--headless',
              '--disable-gpu',
              '--print-to-pdf=' + pdfFilePath,
              htmlFilePath
          ];

        //  If the chrome-binary name is not provided,
        //  look it up and print the .pdf.
        if (chromeBinary == '\0')
            binaryFinder.findChromeBinary().then((result) => {
              self.createPdfFile(result.concat(CLI_ARGS)).then(() => {
                self.createPdfReadStream(pdfFilePath).then((readstream) => {
                  resolve(readstream);
                })
                .catch((error) => {
                    reject(error);
                });
              }).catch((error) => {
                  reject(error);
              });

            }).catch((error) => reject(error) )

        //  If the chrome-binary name is provided,
        //  print the .pdf.
        else
            self.createPdfFile([chromeBinary].concat(CLI_ARGS)).then(() => {
              self.createPdfReadStream(pdfFilePath).then((readstream) => {
                resolve(readstream);
              })
              .catch((error) => {
                  reject(error);
              });
            }).catch((error) => {
                reject(error);
            });
    });
  },

createPdfReadStream: function(pdfFilePath) {
  return new Promise(function(fulfill, reject) {

      // Run interval(1sec) to check if the pdf file is created
      const interval = setInterval(function() {

        if(fs.existsSync(pdfFilePath)) {
          const readstream = fs.createReadStream(pdfFilePath);
          fulfill(readstream);

          console.log('PDF file created');
          clearInterval(interval);
        }
      }, 1000);
    }).catch((error) => {
        reject(error);
    });
},


createPdfFile: function(chromeCommand) {
    return new Promise(function(resolve, reject) {
        exec(chromeCommand.join(' '), (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve("Done");
        });
    });
}

}
