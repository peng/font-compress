const http = require("http");
const urlPath = require("./urlPath");
const { CORS } = require("./util");

const server = http
  .createServer((req, res) => {
    // CORS
    CORS(res);
    // req.m
    let url = req.url;
    if (/minifont/.test(url)) {
      url = "/minifont";
      const name = req.url.split("minifont/")[1];
      urlPath[url](req, res, name);
      return;
    } else if (/notsave/.test(url)) {
      url = "/notsave";
    } else if (!(url in urlPath)) {
      url = "notFound";
    }
    urlPath[url](req, res);
  })
  .listen(8000, "127.0.0.1");
console.log(`
  server start on http://127.0.0.1:8000
`);
