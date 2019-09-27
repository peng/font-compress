<template>
  <div class="admin-box">
    <h1 class="tit" round>用户管理</h1>
    <el-row>
      <el-button type="primary" v-on:click="openAddUser">添加用户</el-button>
      <div class="btn-space"></div>
    </el-row>
    <div class="table-box">
      <el-table :data="members" :stripe="true" style="width: 100%">
        <el-table-column prop="account" label="用户名" width="180"></el-table-column>
        <el-table-column prop="powerName" label="权限" width="180"></el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-on:click="openChgPS(scope.row)">修改密码</el-button>
            <el-button type="text" v-on:click="openChgPower(scope.row)">修改权限</el-button>
            <el-button type="text" v-on:click="delMember(scope.row)">账户删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box-bg" v-show="inputSH.sh">
      <div class="change-password" v-show="inputSH.chgPSsh">
        <el-form :model="changePS" :rules="chgPSRules" ref="chgPS">
          <el-form-item prop="oldpass">
            <el-input v-model="changePS.oldpass" placeholder="请填写旧密码"></el-input>
          </el-form-item>
          <el-form-item prop="newpass">
            <el-input v-model="changePS.newpass" placeholder="请填写新密码"></el-input>
          </el-form-item>
          <el-form-item prop="repPassword">
            <el-input v-model="changePS.repPassword" placeholder="再次确认新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="passwords-btns">
              <el-button type="success" icon="el-icon-check" circle v-on:click="subChgPS"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle v-on:click="clearChgPS"></el-button>
              <el-button icon="el-icon-close" circle v-on:click="closeChgPS"></el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 更改用户权限 -->
      <div class="change-power" v-show="inputSH.chgPowerSh">
        <el-select v-model="chgPower.value" placeholder="请选择要更改的权限">
          <el-option
            v-for="item in chgPower.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-row>
          <div class="power-btns">
            <el-button type="success" icon="el-icon-check" circle v-on:click="subChgPower"></el-button>
            <el-button icon="el-icon-close" circle v-on:click="closeChgPower"></el-button>
          </div>
        </el-row>
      </div>
      <!-- 添加用户窗口 -->
      <div class="add-user" v-show="inputSH.addUser">
        <el-form :model="addUser" :rules="addUserRules" ref="addUser">
          <el-form-item prop="name">
            <el-input v-model="addUser.name" placeholder="添加用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="addUser.password" placeholder="用户密码"></el-input>
          </el-form-item>
          <el-form-item prop="repPassword">
            <el-input type="password" v-model="addUser.repPassword" placeholder="再次确认密码"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="adduser-btns">
              <el-button type="success" icon="el-icon-check" circle v-on:click="subAddUser"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle v-on:click="clearAddUser"></el-button>
              <el-button icon="el-icon-close" circle v-on:click="closeAddUser"></el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.admin-box {
  width: 800px;
  height: 100%;
  min-width: 800px;
  margin: 0 auto;
}
.btn-space {
  width: 100%;
  height: 20px;
}
.table-box {
  width: 700px;
}
.box-bg {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  position: absolute;
  z-index: 2;
  .change-password {
    width: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #efeff4;
    padding: 30px 20px 0 20px;
    z-index: 10;
    border-radius: 10px;
    .passwords-btns {
      margin: 0 auto;
      height: auto;
      text-align: center;
    }
  }
  .change-power {
    width: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #efeff4;
    padding: 0 20px 20px 20px;
    z-index: 10;
    border-radius: 10px;
    text-align: center;
    div {
      margin-top: 20px;
    }
    .power-btns {
      margin: 0 auto;
      height: auto;
      text-align: center;
    }
  }
  .add-user {
    width: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #efeff4;
    padding: 30px 20px 0 20px;
    z-index: 10;
    border-radius: 10px;
    .adduser-btns {
      margin: 0 auto;
      height: auto;
      text-align: center;
    }
  }
}
</style>

<script>
import req from "superagent";
import inter from "../interface";

export default {
  name: "admin",
  data() {
    let notEmpty = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      callback();
    };

    let addUserPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.addUser.repPassword !== "") {
          this.$refs.addUser.validateField("repPassword");
        }
        callback();
      }
    };
    let addUserPassRe = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    // 更改密码验证
    let notEmptyOldPS = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("旧密码不能为空"));
      }
      callback();
    };
    let chgPSRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.changePS.repPassword !== "") {
          this.$refs.chgPS.validateField("repPassword");
        }
        callback();
      }
    };
    let chgPSReRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.changePS.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      members: [
        {
          name: "peng",
          power: "admin"
        }
      ],
      changePS: {
        oldpass: "",
        newpass: "",
        repPassword: "",
        username: ""
      },
      chgPSRules: {
        oldpass: [{ validator: notEmptyOldPS, trigger: "blur" }],
        newpass: [{ validator: chgPSRule, trigger: "blur" }],
        repPassword: [{ validator: chgPSReRule, trigger: "blur" }]
      },
      addUser: {
        name: "",
        password: "",
        repPassword: ""
      },
      addUserRules: {
        name: [{ validator: notEmpty, trigger: "blur" }],
        password: [{ validator: addUserPass, trigger: "blur" }],
        repPassword: [{ validator: addUserPassRe, trigger: "blur" }]
      },
      chgPower: {
        value: "",
        username: "",
        list: [
          {
            value: "admin",
            label: "管理员"
          },
          {
            value: "member",
            label: "普通用户"
          }
        ]
      },
      inputSH: {
        sh: false,
        chgPSsh: false,
        chgPowerSh: false,
        addUser: false
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      req.get(inter.memberList).end((err, res) => {
        if (err) {
          console.error(err);
          this.$message.error("网络错误请重试！");
          return;
        }

        const data = res.body;

        if (data.code == 403) {
          this.$router.push({
            name: "logIn",
            params: {
              from: "admin"
            }
          });
          return;
        }

        if (data.code == 500) {
          console.error(data);
          this.$message.error("网络错误请重试！");
          return;
        }

        if (data.code == 200) {
          console.log(res.body);
          const list = [];
          res.body.list.forEach(item => {
            let powerName = "";
            switch (item.power) {
              case "admin":
                powerName = "管理员";
                break;
              case "member":
                powerName = "普通用户";
                break;
            }
            item.powerName = powerName;
            list.push(item);
          });

          this.members = list;
        }
      });
    },
    closeChgPS() {
      this.inputSH.sh = false;
      this.inputSH.chgPSsh = false;
    },
    openChgPS(item) {
      console.log(item);
      this.inputSH = {
        sh: true,
        chgPSsh: true,
        chgPowerSh: false,
        addUser: false
      };

      this.changePS.username = item.account;
    },
    subChgPS() {
      this.$refs.chgPS.validate(valid => {
        if (valid) {
          this.closeChgPS();
          req
            .post(inter.updatePassword)
            .send({
              name: this.changePS.username,
              password: this.changePS.oldpass,
              newPassword: this.changePS.repPassword
            })
            .end((err, res) => {
              if (err) {
                this.$message.error("网络错误请重试！");
                return;
              }
              const code = res.body.code;

              switch (code) {
                case 200:
                  this.$message({
                    message: "密码修改成功！",
                    type: "success"
                  });
                  this.clearChgPS();
                  this.closeChgPS();
                  break;
                case 401:
                  this.$message.error("旧密码错误请重试！");
                  this.clearChgPS();
                  break;
                case 403:
                  this.$message.error("没有权限！");
                  this.clearChgPS();
                  this.closeChgPS();
                  break;
                case 500:
                  this.$message.error("网络错误请重试！");
                  break;
              }
            });
        }
      });
    },
    clearChgPS() {
      this.$refs.chgPS.resetFields();
    },
    closeChgPower() {
      this.inputSH.sh = false;
      this.inputSH.chgPowerSh = false;
    },
    openChgPower(item) {
      this.inputSH = {
        sh: true,
        chgPSsh: false,
        chgPowerSh: true,
        addUser: false
      };

      this.chgPower.username = item.account;
    },
    subChgPower() {
      if (this.chgPower.value == "") {
        this.$message({
          message: "请选择一个选项",
          type: "warning"
        });
        return;
      }
      req
        .post(inter.updatePower)
        .send({
          name: this.chgPower.username,
          power: this.chgPower.value
        })
        .end((err, res) => {
          if (err) {
            this.$message.error("网络错误请重试！");
            return;
          }
          const code = res.body.code;

          switch (code) {
            case 200:
              this.$message({
                message: "权限更改成功！",
                type: "success"
              });
              this.closeChgPower();
              this.getList();
              this.chgPower.value = "";
              break;
            case 400:
              this.$message.error("参数错误！");
              break;
            case 403:
              this.$message.error("没有权限！");
              this.closeChgPower();
              break;
            case 500:
              this.$message.error("网络错误请重试！");
              this.chgPower.value = "";
              break;
          }
        });
    },
    closeAddUser() {
      this.inputSH.sh = false;
      this.inputSH.addUser = false;
    },
    openAddUser() {
      this.inputSH = {
        sh: true,
        chgPSsh: false,
        chgPowerSh: false,
        addUser: true
      };
    },
    subAddUser() {
      this.$refs.addUser.validate(valid => {
        if (valid) {
          this.closeAddUser();
          req
            .post(inter.signMem)
            .send({
              user: this.addUser.name,
              password: this.addUser.password
            })
            .end((err, res) => {
              if (err) {
                this.$message.error("网络错误请重试！");
                return;
              }
              const code = res.body.code;
              if (code == 200) {
                this.$message({
                  message: "添加成功！",
                  type: "success"
                });
                this.getList();
                this.clearAddUser();
              } else if (code == 614) {
                this.$message.error("用户已经存在请勿重添加！");
                this.clearAddUser();
              } else if (code == 400) {
                this.$message.error("参数错误！");
                this.clearAddUser();
              } else {
                this.$message.error("网络错误请重试！");
              }
            });
        }
      });
    },
    clearAddUser() {
      this.$refs.addUser.resetFields();
    },
    delMember(item) {
      this.$confirm("确定删除此成员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        () => {
          req
            .post(inter.memberDel)
            .send({
              name: item.account
            })
            .end((err, res) => {
              if (err) {
                this.$message.error("网络错误请重试！");
                return;
              }
              const code = res.body.code;

              switch (code) {
                case 200:
                  this.$message({
                    message: "用户删除成功！",
                    type: "success"
                  });
                  this.getList();
                  break;
                case 403:
                  this.$message.error("没有权限！");
                  break;
                case 500:
                  this.$message.error("网络错误请重试！");
                  break;
              }
            });
        },
        err => {
          console.log(err);
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        }
      );
    }
  }
};
</script>