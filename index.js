"use strict"
const fs = require('fs');
const os = require('os');
const binaryFinder = require('./binary_finder.js');
const { exec } = require('child_process');

const self = module.exports = {

  createHtmlFile: function(content, filename) {
      const htmlFilePath = os.tmpdir() + '/' + filename + '.html';

      fs.writeFile(htmlFilePath, content, function(err) {
          if(err) {
            console.error('Error creating .html file: ', err);
            return;
          }
        });

        console.log('HTML file created!');
        return htmlFilePath;
  },

  removeHtmlFile: function(htmlfile) {
    return new Promise(function (resolve, reject) {
      exec('rm ' + htmlfile, (err, stdout, stderr) => {
        if(err) reject(err);
        console.log('HTML file removed!');
        resolve(stdout);
      });
    });
  },

  convertMailBodyToPdf: function(content, filename, removeflag = true, chromeBinary = '\0', outputPath = os.tmpdir() + '/') {
      return new Promise(function (resolve, reject) {
          const pdfFilePath   = outputPath + filename + '.pdf',
              htmlFilePath = self.createHtmlFile(content, filename);
          var CLI_ARGS = [
              '--headless',
              '--disable-gpu',
              '--print-to-pdf=' + pdfFilePath,
              'file://' + htmlFilePath
          ];

        //  If the chrome-binary name is not provided,
        //  look it up and print the .pdf.
        if (chromeBinary == '\0')
            binaryFinder.findChromeBinary().then((result) => {
              self.createPdfFile(result.concat(CLI_ARGS)).then(() => {
                self.createPdfReadStream(pdfFilePath).then((readstream) => {
                  if(removeflag) self.removeHtmlFile(htmlFilePath);
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
                if(removeflag) self.removeHtmlFile(htmlFilePath);
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

          console.log('PDF file created!');
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
