<template>
  <div class="Logindiv">
    <div class="logodiv">
      <img src="../assets/logohdpi.png"/>
    </div>
    <!--<div class="tiptext">-->
    <!--<p>{{msg}}</p>-->
    <!--</div>-->
    <div class="inputdiv">
        <span>
          <img src="../assets/house.png"/>
        </span>
      <input placeholder="MD11209" type="text" id="mobile"/>
    </div>
    <div class="inputdiv">
        <span>
          <img src="../assets/member.png"/>
        </span>
      <input placeholder="员工编号" type="text" id="code"/>
    </div>
    <div class="inputdiv">
      <span>
        <img src="../assets/password.png">
      </span>
      <input placeholder="密码" type="password" id="password"/>
    </div>
    <div class="btdiv">
      <button @click="onLogin">登录</button>
    </div>
  </div>

</template>
<script>
  import axios from 'axios'
  export default{
    name: 'Login',
    created(){
      document.title = "登录";
    },
    methods: {
      onLogin: function (event) {
        var LoginData = new Object();
        var code = document.getElementById("code").value;
        var mobile = document.getElementById("mobile").value;
        var password = document.getElementById("password").value;
        if (code == "") {
          alert("员工编号不能为空");
          return;
        }
        if (mobile == "") {
          alert("门店编号不能为空");
          return;
        }
        if (password == "") {
          alert("密码不能为空");
          return;
        }
        ;
        window.localStorage.setItem("merchantId", mobile);
        var qs = require('qs');
        var me = this;
        axios.post("/login",
          qs.stringify({
            code: code,
            mobile: mobile,
            password: password
          }),
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function (res) {
          console.log(res);
          me.$router.push(
            '/home', 'Home'
          )
        })
          .catch(function (error) {
            console.log(error);
          });

      }
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },

    created(){
      const mer = 32
      const ShopId = 119;
      const tab = 912;
      window.localStorage.setItem("ShopId", ShopId);
//      if (ShopId) {
//        this.$router.push(
//          '/room', 'Room'
//        )
//      } else {
//        return;
//      }
    }
  }
</script>

<style scoped>
  .Logindiv {
    height: 100%;
    width: 100%;
    font-size: 0.75em;
    /*padding: 0px 20px;*/
    /*display: flex;*/
    /*align-items: center;*/
  }

  .logodiv {
    text-align: center;
    margin: 3.25em auto 0px;
  }

  .tiptext {
    width: 100%;
    text-align: center;
  }

  .inputdiv {
    /*padding: 0px 10%;*/
    margin: 0px 10%;
    /*display: block;*/
    float: left;
    width: 80%;
    height: auto;
    border-bottom: 1px solid #E3E9EB;
    display: flex;
    align-items: center;
  }

  .inputdiv input {
    flex-grow: 1;
    padding: 10px 0px;
    line-height: 40px;
    color: #C6CDD4;
    /*float: left;*/
    border: none;
    /*flex: 1;*/
  }

  .inputdiv input:focus {
    outline: none;
  }

  .inputdiv span {
    margin-right: 1.5625em;
    /*float: left;*/
  }

  .btdiv {
    width: 100%;
    margin: 1.25em auto;
  }

  .btdiv button {
    border: none;
    padding: 0.625em;
    margin: 0px 10%;
    margin-top: 20px;
    width: 80%;
    /*display: block;*/
    background-color: rgb(230, 117, 0);
    font-family: PingFangSC-Regular;
    font-size: 1.25em;
    color: #FFFFFF;
    line-height: 32px;
    border-radius: 4px;
    height: auto;
  }
</style>
