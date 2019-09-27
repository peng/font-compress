
class MockResponse {
  constructor() {
    this.headers = {};
    this.stausCode = 0;
    this.writeMes = [];
  }
  setHeader(key, val) {
    this.headers[key] = val;
  }
  writeHead(code, headers) {

    this.stausCode = code;
    Object.assign(this.headers, headers);

  }
  write(data, encoding, callback) {
    if (encoding) {
      this.writeMes.push({ data, encoding });
    };
    this.writeMes.push({ data });
    callback && callback();
  }
  end(data, encoding, callback) {
    if (data) {
      this.write(data, encoding);
    }

    callback && callback()
  }
}

class MockRequest {
  constructor() {
    this.method = '';
    this.headers = {};
  }
  
}

module.exports = { MockResponse, MockRequest };