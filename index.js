const http = require('http');
const app = require('./app')

// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'})
//     res.write("<h1>hello Akash</h1>");
//     res.end();
// })

const server = http.createServer(app);

server.listen(3000, () => console.log("server is running on port 3000"));