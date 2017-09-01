'use strict'

const os = require('os');
const BinaryFinder = require('./binary-finder.js');
const FileOps = require('./fileops.js');

const fileOps = new FileOps();
const binaryFinder = new BinaryFinder();

function MailConverter() {
  this.convertMailBodyToPdf = function convertMailBodyToPdf(content, filename,
    outputPath, removeflag, chromeBinary) {
    return new Promise((resolve, reject) => {
      let opath;
      let rmflag = removeflag;

      if (!filename) {
        reject('Filename not specified!');
      }

      if (typeof rmflag === 'undefined' || rmflag == null) {
        rmflag = true;
      }

      if (!opath) {
        opath = `${os.tmpdir()}${'/'}`;
      } else {
        opath += '/';
      }

      const pdfFilePath = `${opath}${filename}${'.pdf'}`;
      const htmlFilePath = fileOps.createHtmlFile(content, filename, opath);
      const CLI_ARGS = [
        '--headless',
        '--disable-gpu',
        `--print-to-pdf=${pdfFilePath}`,
        `file://${htmlFilePath}`
      ];

      if (!chromeBinary) {
        //  If the chrome-binary name is not provided,
        //  look it up and print the .pdf.
        binaryFinder.findChromeBinary().then((result) => {
          fileOps.printHTMLtoPdf(result.concat(CLI_ARGS), pdfFilePath, htmlFilePath, rmflag)
            .then((readStream) => { resolve(readStream); })
            .catch((readStreamError) => { reject(readStreamError); });
        }).catch((error) => { reject(error); });
      } else {
      //  If the chrome-binary name is provided,
      //  print the .pdf with the given binary name.
        fileOps.printHTMLtoPdf([chromeBinary].concat(CLI_ARGS),
          pdfFilePath, htmlFilePath, removeflag)
          .then((readStream) => { resolve(readStream); })
          .catch((error) => { reject(error); });
      }
    }).catch((error) => { throw error; });
  };
}

module.exports = MailConverter;
