const http = require("http"),
  urlPath = require("./urlPath"),
  { CORS } = require("./util"),
  https = require("https"),
  { keyPath, certPath } = require("./config").https,
  fs = require("fs"),
  { server: serConfig } = require("./config");

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
    } else if (/\/page\//.test(url)) {
      url = "/page";
    } else if (!(url in urlPath)) {
      url = "notFound";
    }
    urlPath[url](req, res);
  })
  .listen(serConfig.httpPort);
console.log(`
  server start on http://${serConfig.host}${
  serConfig.httpPort == 80 ? "" : ":" + serConfig.httpPort
}
`);

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

const sslServer = https
  .createServer(options, (req, res) => {
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
    } else if (/\/page\//.test(url)) {
      url = "/page";
    } else if (!(url in urlPath)) {
      url = "notFound";
    }
    urlPath[url](req, res);
  })
  .listen(serConfig.httpsPort);

console.log(`
server start on https://${serConfig.host}${
  serConfig.httpsPort == 443 ? "" : ":" + serConfig.httpsPort
}
`);
