// const { CORS, methodCheck, md5, validator, authentication } = require('../../src/util');
// const { MockResponse, MockRequest } = require('./tools');
import {
  CORS,
  methodCheck,
  md5,
  validator,
  authentication
} from "../../src/util";
import { MockResponse, MockRequest } from "./tools";

test("CORS method test", () => {
  const mockResp = new MockResponse();
  CORS(mockResp);
  expect(mockResp.headers).toEqual({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-Requested-With",
    "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
    "X-Powered-By": " 3.2.1",
    "Content-Type": "application/json;charset=utf-8"
  });
});

test("md5 method test", () => {
  expect(md5("md5 method test")).toBe("f6dcc39c18ffba54cc41aafadc0bc1c9");
});

test("http method check test", () => {
  const req = new MockRequest(),
    res = new MockResponse();
  req.method = "GET";
  expect(methodCheck(req, res, "GET")).toBeTruthy();
  expect(methodCheck(req, res, "POST")).toBeFalsy();
  expect(res.stausCode).toBe(405);
  expect(res.headers).toEqual({ "Content-Type": "text/plain" });
  expect(res.writeMes).toEqual([{ data: "405 error! Method Not Allowed!" }]);
});

const { selectData } = require("../../src/util/database.js");
jest.mock("../../src/util/database.js");

test("authentication user pass", done => {
  selectData.mockResolvedValue({
    result: [
      {
        account: "peng",
        session: "e4d19626e9bc87af6dd62566e151f976",
        power: "member"
      }
    ]
  });

  const req = new MockRequest();
  req.headers.cookie =
    "_antanalysis_s_id=1548744689200; Hm_lvt_2462e2d1c4859883c428e8da7b3b4b18=1557999241; Hm_lpvt_2462e2d1c4859883c428e8da7b3b4b18=1557999337; si=1ba6524092ea4e4ead50a85066e29480; iamold=iamold; sidebarStatus=0; toolsite=e4d19626e9bc87af6dd62566e151f976; toolsitename=peng";

  authentication(req, "member").then(data => {
    expect(data).toEqual({
      desc: "success",
      result: true,
      data: {
        account: "peng",
        session: "e4d19626e9bc87af6dd62566e151f976",
        power: "member"
      }
    });

    done();
  });
});

test("authentication user is no power", done => {
  selectData.mockResolvedValue({
    result: [
      {
        account: "peng",
        session: "e4d19626e9bc87af6dd62566e151f976",
        power: "member"
      }
    ]
  });

  const req = new MockRequest();
  req.headers.cookie =
    "_antanalysis_s_id=1548744689200; Hm_lvt_2462e2d1c4859883c428e8da7b3b4b18=1557999241; Hm_lpvt_2462e2d1c4859883c428e8da7b3b4b18=1557999337; si=1ba6524092ea4e4ead50a85066e29480; iamold=iamold; sidebarStatus=0; toolsite=e4d19626e9bc87af6dd62566e151f976; toolsitename=peng";

  authentication(req, "root").then(data => {
    expect(data).toEqual({
      desc: "user is no power",
      result: false,
      data: [
        {
          account: "peng",
          session: "e4d19626e9bc87af6dd62566e151f976",
          power: "member"
        }
      ]
    });

    done();
  });
});

test("authentication not find user test", done => {
  selectData.mockResolvedValue({
    result: []
  });

  const req = new MockRequest();
  req.headers.cookie =
    "_antanalysis_s_id=1548744689200; Hm_lvt_2462e2d1c4859883c428e8da7b3b4b18=1557999241; Hm_lpvt_2462e2d1c4859883c428e8da7b3b4b18=1557999337; si=1ba6524092ea4e4ead50a85066e29480; iamold=iamold; sidebarStatus=0; toolsite=e4d19626e9bc87af6dd62566e151f976; toolsitename=peng";

  authentication(req, "member").then(data => {
    expect(data).toEqual({
      desc: "user session not found",
      result: false,
      data: []
    });

    done();
  });
});

test("validator test", () => {
  const { account, password } = validator;

  // test account
  expect(account("pen")).toEqual({
    result: false,
    desc: "min"
  });

  expect(account("lovepenglovepenglovepenglovepeng")).toEqual({
    result: false,
    desc: "max"
  });

  expect(account("peng")).toEqual({
    result: true,
    desc: "reg"
  });

  // test password

  expect(password("12345")).toEqual({
    result: false,
    desc: "min"
  });

  expect(password("lovepeng123456lovepeng123456lovepeng123456")).toEqual({
    result: false,
    desc: "max"
  });

  expect(password("123456")).toEqual({
    result: true,
    desc: "reg"
  });
});
