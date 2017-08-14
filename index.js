const os = require('os');
const BinaryFinder = require('./binary_finder.js');
const FileOps = require('./fileops.js');

const fileOps = new FileOps();
const binaryFinder = new BinaryFinder();

function MailConverter() {
  this.convertMailBodyToPdf = function (content, filename, removeflag = true, chromeBinary = '\0', outputPath = `${os.tmpdir()}${'/'}`) {
    return new Promise((resolve, reject) => {
      const pdfFilePath = `${outputPath}${filename}${'.pdf'}`;
      const htmlFilePath = fileOps.createHtmlFile(content, filename);
      const CLI_ARGS = [
        '--headless',
        '--disable-gpu',
        `--print-to-pdf=${pdfFilePath}`,
        `file://${htmlFilePath}`
      ];
      if (chromeBinary === '\0') {
        //  If the chrome-binary name is not provided,
        //  look it up and print the .pdf.
        binaryFinder.findChromeBinary().then((result) => {
          fileOps.printHTMLtoPdf(result.concat(CLI_ARGS), pdfFilePath, htmlFilePath, removeflag)
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
    });
  };
}

module.exports = MailConverter;
