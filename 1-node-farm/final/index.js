const fs = require('fs');
const slugify = require('slugify');

// const textIn = fs.readFileSync('1-node-farm/final/txt/input.txt','utf-8')
// console.log(textIn);;

// const textOut = `About Avacado: ${textIn} \n Created on ${Date.now()}`
// fs.writeFileSync('1-node-farm/final/txt/output.txt',textOut)
// console.log('File written!!!!!!!!!!!!!!')
// console.log(textOut);

const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js'); //importing our own modules
const data = fs.readFileSync('1-node-farm/final/dev-data/data.json', 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

//READING THE FILES
const templateOverview = fs.readFileSync(
  '1-node-farm/final/templates/template-overview.html',
  'utf-8'
);
const templateCard = fs.readFileSync(
  '1-node-farm/final/templates/template-card.html',
  'utf-8'
);
const templateProduct = fs.readFileSync(
  '1-node-farm/final/templates/template-product.html',
  'utf-8'
);

//CREATION OF A WEB SERVER

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); //parsing the url(by tragetting the query(id part))

  //OVERVIEW
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardHtml = dataObject.map((el) => replaceTemplate(templateCard, el));
    const out = templateOverview.replace(/{%PRODUCT_CARDS%}/, cardHtml);
    res.end(out);
  }

  //PRODUCT
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObject[query.id];
    const output = replaceTemplate(templateProduct, product); //retrieving element from a string
    res.end(output);
  }

  //API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  //NOT FOUND
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1 style="color:blue">Page not found</h1>');
  }
});

//Listening to requests
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests');
});
