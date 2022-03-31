const http = require('http');

const hostname = 'localhost';
const port = 3000;

const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} by method ${req.method}`);

    if (req.method === 'GET') {
        let fileUrl = req.url;
        if (fileUrl === '/') {
            fileUrl = '/index.html';
        }
        const filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);
        console.log('path', path);
        console.log('filePath', filePath);
        console.log('fileExt', fileExt);
        console.log('fileUrl', fileUrl);

        if (fileExt === '.html') {
            fs.access(filePath, (err) => {
                if (err) {
                    console.log('fs.access: ', err);
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(`<html><body><h1>${fileUrl} not found</h1></body></html>`);
                    return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            });
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html><body><h1>${fileUrl} is not an HTML file</h1></body></html>`);
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(
            `<html><body><h1>Error 404: ${req.method} method not supported</h1></body></html>`
        );
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
