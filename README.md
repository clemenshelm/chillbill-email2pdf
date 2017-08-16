# chillbill-email2pdf

Converts sended email(s) into HTML and finally to PDF.

## Usage
You can fetch the package with the following command:
```javascript
var Mailconverter = require('chillbill-email2pdf');
const mailconverter = new MailConverter();
```

To convert mail content to pdf:
```javascript

mailconverter.convertMailBodyToPdf(content, filename, removeFlag, chromeBinary, outputpath);
```
* **content:** Content(text, body-html) you want to parse first into html and then to pdf
* **filename:** Name of the file(HTML and PDF)
* **removeflag (optional):**
 * true: Delete html file after creating the pdf file!
 * false: Keeps the html file!
* **chromeBinary:** Tries to run installed Chrome browser on the server. If your server has no chrome browser nothing won't be converted. Install the Chrome browser on your PC.
* **outputPath (optional):** Specifies where the html and pdf file should be saved!
