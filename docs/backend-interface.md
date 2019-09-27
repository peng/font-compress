# backend interface

1. `/fontlist`  
   get font list  
   `method GET`  
   no data to send

Response

```javascript
code 200
{
  code: 200,
  data: [
    {
      name: 'font.ttf',
      type: 'ttf
    },
    {
      name: 'font2.ttf',
      type: 'ttf'
    }
  ]
}

code 403
{
  code: 403,
  desc: 'please login'
}

code 500
database select data fail
{
  code: 500,
  desc: 'select data fail'
}
```

2. `/notsave`  
   get mini font and don't save on the server  
   `GET method`

```javascript
param '?font=我的字体文件&type=ttf&words=需要压缩的字体'
```

3. `/uploadfont`  
   upload font file
   `POST method`

```javascript
set http headers
{
  "Content-Disposition": "filename=filename"
}

set body data
{
  file buffer
}
```

4. `/updatepassword`  
   change password interface  
   `POST method`

```javascript
// http request body application/json
{
  "name": "username", // user account name
  "password": "oldPassword" // user old password
  "newPassword": "newPassword" // user new password
}

// http response
// success
{
  "code": 200,
  "desc": "success"
}

// Forbidden
{
  "code": 403,
  "desc": "Forbidden"
}

// server error
{
  "code": 500,
  "desc": "some thing wrong in server!"
}

// user name or password error
{
  "code": 401,
  "desc": "user name or password error"
}
```

5. `/updatepower`  
   change user power, two select `admin` and `member`  
   `POST method`

```javascript

// http request body application/json

{
  "name": "userName" // user name
  "power": "userPower" // user power what to change
}

// http response
// success
{
  "code": 200,
  "desc": "success"
}


// params error
{
  code: 400,
  desc: "param error"
}

// Forbidden
{
  "code": 403,
  "desc": "Forbidden"
}

// server error
{
  "code": 500,
  "desc": "some thing wrong in server!"
}
```

6. `/memberdel`  
   delete member interface
   `POST method`

```javascript

// http request body application/json

{
  "name": "userName" // user name
}

// http response

// success
{
  "code": 200,
  "desc": "success"
}

// Forbidden
{
  "code": 403,
  "desc": "Forbidden"
}

// server error
{
  "code": 500,
  "desc": "some thing wrong in server!"
}
```
