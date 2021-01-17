const http = require('http');
const fs = require('fs').promises;

const fileData = {
  htmlFilePath: '/public/index.html',
  htmlContentType: ['Content-Type', 'text/html'],
  cssFilePath: '/style/todo.css',
  cssContentType: ['Content-Type', 'text/css'],
  jsFilePath: '/js/todo.js',
  jsContentType: ['Content-Type', 'text/javascript'],
};

const serverServeAndReadFile = async (res, filePath, fileContentType) => {
  res.setHeader(fileContentType[0], fileContentType[1]);
  res.writeHead(200);
  res.write(
    await fs.readFile(`${__dirname}${filePath}`, (err, data) => {
      const file = data;
      return file;
    })
  );
};

const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case fileData.cssFilePath:
      await serverServeAndReadFile(
        res,
        fileData.cssFilePath,
        fileData.cssContentType
      );
      break;
    case fileData.jsFilePath:
      await serverServeAndReadFile(
        res,
        fileData.jsFilePath,
        fileData.jsContentType
      );
      break;
    default:
    case '/':
      await serverServeAndReadFile(
        res,
        fileData.htmlFilePath,
        fileData.htmlContentType
      );
      break;
  }
  res.end();
});

server.listen(3000, 'localhost', console.log('App running on localhost 3000'));
