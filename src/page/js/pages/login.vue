<template>
  <div class="signin-box" >
    <h2 class="tit" >用户登录</h2>
    <el-form ref="form" :model="ruleForm" label-width="auto" :rules="rules" >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入用户名" maxlength="25" minlength="3" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass" >
        <el-input type="password" placeholder="请输入密码" v-model="ruleForm.pass" autocomplete="off" maxlength="25" minlength="6" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('form')" >登录</el-button>
        <el-button @click="resetForm('form')" >重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less">
.signin-box {
  max-width: 400px;
  margin: auto;
  .tit {
    text-align: center;
  }
}
</style>

<script>
// const { validator } = require('../../../util/index');
import { validator } from '../util';
import req from 'superagent';
import inter from '../interface';

export default {
  name: 'logIn',
  data() {
    const nameCheck = (rule, value, callback) => {
      const res = validator.account(value);
      // console.log(res);
      if (res.result) {
        callback();
      } else {
        const desc = {
          'max': '用户名长度过长！',
          'min': '用户名长度过短！',
          'reg': '用户名必须为字符串和数字组合！'
        };

        callback(new Error(desc[res.desc]));
      }
    };

    const passCheck = (rule, value, callback) => {
      const res = validator.password(value);
      // console.log(res);
      if (res.result) {
        callback();
      } else {
        const desc = {
          'max': '密码长度过长！',
          'min': '密码长度过短！',
          'reg': '密码必须为字符串数字特殊字符串组合！'
        };

        callback(new Error(desc[res.desc]));
      }
    };

    return {
      ruleForm: {
        name: '',
        pass: ''
      },
      rules: {
        name: [
          { required: true, message: '用户名必填', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { validator: passCheck, trigger: 'blur' }
        ]
      },
      succJump: {
        name: 'home'
      }
    };
  },
  mounted() {
    if (this.$route.params.from) {
      this.succJump.name = this.$route.params.from;
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          req
            .post(inter.logIn)
            .send({
              account: this.ruleForm.name,
              password: this.ruleForm.pass
            })
            .end((err, res) => {
              if (err) {
                console.error(err);
                this.$message('网络错误请重试！');
              }
              console.log(res);
              const { body } = res;
              if (body.code == 401) {
                console.log(this);
                this.$message('账号或密码错误！');
                return;
              }

              if (body.code == 200) {
                // const hour = 1;
                // const expireTime = new Date(new Date().getTime() + hour * 60 * 60 * 1000).toGMTString();
                // document.cookie = `toolsitename=${this.ruleForm.name}; Expires=${new Date(expireTime)}`;
                this.$message('登录成功即将跳转！');
                this.$router.push(this.succJump);
                
                
              } else {
                this.$message('网络错误请重试！');
              }
            })
        }
        console.log(valid);
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>