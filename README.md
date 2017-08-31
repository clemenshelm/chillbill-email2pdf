# email2pdf

## Description
This module **converts an e-mail** from html/plain-text **into a .pdf-file** and stores
it where you want it to be stored. **It returns a readstream to the .pdf.**

## Requirements
In order to use this package, you need ...
* **Linux** running on your (server) system
* the **BASH as the common shell**
* **Google Chrome** with **at least version 59**, since the pdf printing is based on a **Headless Chrome** functionality (More about Headless Chrome: https://developers.google.com/web/updates/2017/04/headless-chrome)

## Installation
```npm
npm install email2pdf --save
```

## Basic Usage
```javascript
const Mail2PDF = require('email2pdf');
const mail2pdf = new Mail2PDF();
```

### All parameters:
```javascript
/*

  content: E-mail content in html or plain-text format to be converted to .pdf

  filename: Name of the .pdf-file (Note: You just need to specify the name without an extension (WRONG: name.pdf)

  outputPath (OPTIONAL): Specifies .pdf file (and the .html) should be saved. If not specified(null), it will be stored on the tmp-directory of the system. If you want to save the file on a specific directory, type in the absolute path.

  removeflag (OPTIONAL): Flag to keep/remove the .html file, which is created during the process
    true (DEFAULT): Delete html file after creating the pdf file (Note: If you keep the .html file, it will have the same name as the .pdf file)
    false: Keep the html file

  chromeBinary (OPTIONAL):
    null (DEFAULT): It will look up for chrome on your system
    "NameOfTheChromeBinary" (String): Runs chrome with the given binary name (Note: It's the name you would normally write in your CLI to start chrome: e.g.: chrome/google-chrome ...) OPTIONS: google-chrome, chrome
*/
mail2pdf.convertMailBodyToPdf(content, filename, outputPath, removeFlag, chromeBinary)
  .then((result) => {
    // Note: 'result' is a stream to the .pdf
    result.on('data', (bytes) => {
       // DO SOMETHING WITH THE BYTES
    });

    result.on('end', () => {
       res.writeHead(200);
       res.end('Done');
    });
});
```

### Example:

```javascript
const http = require('http');
const mail2pdf = require('email2pdf');
const Busboy = require('busboy');
const body = {};

const mailtopdf = new MailConverter();
http.createServer(function(req, res) {
  if (req.method === 'POST') {
    var busboy = new Busboy({ headers: req.headers });
    //  Parses form-data and url-encoded http bodies
    //  and stores the content in a variable
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      body[fieldname] = val;
    });

    busboy.on('finish', function() {
      //
      mail2pdf.convertMailBodyToPdf(body['body-html'], 'output', null, false)
        .then((result) => {
        // Note: 'result' is a read-stream to the .pdf
        result.on('data', (bytes) => {
            // DO SOMETHING WITH THE BYTES
        });

        result.on('end', () => {
          res.writeHead(200);
          res.end('Done');
        });
       });
     });
     req.pipe(busboy);
   } else {
     res.writeHead(400);
     res.end('Wrong http request header\n');
   }
}).listen(8080, function() {
  console.log('Listening for requests');
});
```

### Snippets with extra parameters:

Basic parameters:

```javascript
// Removeflag specified
mailtopdf.convertMailBodyToPdf(body['body-html'], 'output')
  .then((result) => {
      // Note: 'result' is a read-stream to the .pdf
      result.on('data', (bytes) => {
         // DO SOMETHING WITH THE BYTES
      });

      result.on('end', () => {
        res.writeHead(200);
        res.end('Done');
      });
});
```
Removeflag specified:
```javascript
mailtopdf.convertMailBodyToPdf(body['body-html'], 'output', null, false)
  .then((result) => {
    // Note: 'result' is a read-stream to the .pdf
    result.on('data', (bytes) => {
      // DO SOMETHING WITH THE BYTES
    });

    result.on('end', () => {
      res.writeHead(200);
      res.end('Done');
    });
});
```
Chrome binary specified:
```javascript
// Removeflag specified
mailtopdf.convertMailBodyToPdf(body['body-html'], 'output', null, null, 'google-chrome')
  .then((result) => {
    // Note: 'result' is a read-stream to the .pdf
    result.on('data', (bytes) => {
      // DO SOMETHING WITH THE BYTES
    });

    result.on('end', () => {
      res.writeHead(200);
      res.end('Done');
    });
});
```
Path specified:
```javascript
mailtopdf.convertMailBodyToPdf(body['body-html'], 'output', '/home/chillbill/Documents', false)
  .then((result) => {
    // Note: 'result' is a read-stream to the .pdf
    result.on('data', (bytes) => {
      // DO SOMETHING WITH THE BYTES
    });

    result.on('end', () => {
      res.writeHead(200);
      res.end('Done');
    });
});
```
