export const validator = {
  account (account) {
    if (account.length < 3) {
      return {
        result: false,
        desc: 'min'
      };
    };
    if (account.length > 25) {
      return {
        result: false,
        desc: 'max'
      };
    };
    
    const reg = /^[a-zA-Z]\w{2,24}$/;
    return {
      result: reg.test(account),
      desc: 'reg'
    };
  },
  password(password) {
    /* 
      6-25个字符串，英文大小写,数字，英文特殊符号
    */
   if (password.length < 6) {
     return {
       result: false,
       desc: 'min'
     };
   };

   if (password.length > 25) {
     return {
       result: false,
       desc: 'max'
     };
   };

    const reg = /[A-Za-z0-9\!@#\$\%\^\&\*\(\\.\?)]{6,25}$/;
    return {
      result: reg.test(password),
      desc: 'reg'
    }
  }
};
