<template>
  <div class="font-box" >
    <el-row>
      <el-button type="primary" round v-on:click="logOut" >登出</el-button>
    </el-row>
    <div class="upload-box" >
      <el-upload 
        drag
        action="/uploadfont"
        :headers="headers"
        :before-upload="beforeUpload"
        :on-success="fontSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传字体文件</div>
      </el-upload>
    </div>
    <div class="list-box" >
      <el-table
        :data="fontList.list"
        style="width: 100%"
       >
        <el-table-column
          prop="name"
          label="字体名"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="字体类型"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="操作"
          min-width="70"
          v-if="fontList.delSH"
        >
          <template slot-scope="scope" >
            <el-button type="text" v-on:click="fontDelete(scope.$index, scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  
</template>

<style lang="less">
.font-box {
  margin-left: 20px;
  .upload-box {
    padding: 20px;
  }
  .list-box {
    width: 600px;
    height: 500px;
  }
}

</style>

<script>
import req from 'superagent';
import inter from '../../interface';

export default {
  name: 'Font',
  data() {
    return {
      headers: {
        "Content-Disposition": ""
      },
      fontList: {
        list: [],
        delSH: false
      }
    };
  },
  mounted() {
    this.delPowerCheck();
    this.getFontList();
  },
  methods: {
    delPowerCheck() {
      const cookie = document.cookie;
      if (cookie == '') {
        return;
      }

      const noSpace = cookie.replace(' ','');
      const cookies = noSpace.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const key = cookies[i].split('=')[0],
          value = cookies[i].split('=')[1];
        
        if (key == 'power' && (value == 'admin' || value == 'root')) {
          this.fontList.delSH = true;
        }
      }
    },
    fontPreview() {},
    fontRemove() {},
    fontSuccess(response, file, fileList) {
      if (response.code == 614) {
        this.$message({
          message: '已有字体，字体请勿重复添加！',
          type: 'warning'
        });
        return;
      };

      this.getFontList();
    },
    fontError() {},
    fontProgress() {},
    beforeUpload(file) {
      // console.log(file);
      // const oInput = document.querySelectorAll('.el-upload__input');
      // console.log(oInput);
      this.headers["Content-Disposition"] = `filename=${file.name}`;
    },
    getFontList() {
      req
        .get(inter.fontList)
        .end((err, res) => {
          if (err) {
            this.$message({
              message: '网络错误！',
              type: 'error',
              duration: 2000
            });
            console.error(err);
            return;
          }
          // console.log(res);
          const data = res.body;

          if (data.code == 403) {
            this.$message({
              message: '请登录！',
              type: 'warning',
              duration: 2000,
              onClose: () => {
                this.$router.push({
                  name: 'logIn',
                  params: {
                    from: 'homeFont'
                  }
                });
              }
            })
            return;
          };

          if (data.code == 500) {
            this.$message({
              message: '数据选择失败，请重试！',
              type: 'error',
              duration: 2000
            });
            return;
          };
          this.fontList.list = data.data;
        })
    },
    fontDelete(index, item) {
      req
        .post(inter.fontDelete)
        .send({
          name: item.name
        })
        .end((err, res) => {
          if (err) {
            this.$message({
              message: '网络错误！',
              type: 'error',
              duration: 2000
            });
            console.error(err);
            return;
          }
          // console.log(res);
          const data = res.body;

          if (data.code == 403) {
            this.$message({
              message: '没有删除权限！请联系管理员',
              type: 'warning',
              duration: 2000,
              onClose: () => {
                this.$router.push({
                  name: 'logIn',
                  params: {
                    from: 'homeFont'
                  }
                });
              }
            })
            return;
          };

          if (data.code == 500) {
            this.$message({
              message: '删除失败，请重试！',
              type: 'error',
              duration: 2000
            });
            return;
          };

          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 2000
          });

          this.getFontList()
        })
    },
    logOut() {
      document.cookie = 'toolsite=; expires=';
      document.cookie = 'power=; expires=';
      this.$router.push({
        name: 'logIn',
        params: {
          from: 'homeFont'
        }
      });
    }
  }
}
</script>