// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments.json');

// Create server
http.createServer((req, res) => {
    // Parse request
    const urlObj = url.parse(req.url, true);

    // Handle comments
    if (urlObj.pathname === '/comments' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comments));
        return;
    }

    if (urlObj.pathname === '/comments' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const newComment = JSON.parse(body);
            comments.push(newComment);
            fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), (err) => {
                if (err) {
                    res.statusCode = 500;
                    res.end('Could not write to file');
                    return;
                }
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newComment));
            });
        });
        return;
    }

    // Handle static files
    let filePath = path.join(__dirname, urlObj.pathname);
    if (filePath === path.join(__dirname, '/')) {
        filePath = path.join(__dirname, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}).listen(3000, () => {
    console.log('Server is listening on port 3000');
});