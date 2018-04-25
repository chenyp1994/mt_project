<template>
  <div class="pay_container">
    <div class="top_first">
      <span @click="goback()"><img src="../../assets/back.png"/></span>下单
    </div>
    <!--<div class="shopname_div">-->
    <!--<span><img src="../../assets/shop_color.png"/></span>{{shopName}}-->
    <!--</div>-->
    <div class="tablename_div">{{tableName}}</div>
    <div class="menu_div">
      <ul>
        <li v-for="item in menus">
          <div class="Img_div">
            <img :src="'http://113.105.152.179:8080/foodimage/png/'+item.avator"/>
          </div>
          <div class="menu_list_div">
            <p class="menu_name_p">{{item.name}}<span class="cost_span">&yen;{{item.weixin}}</span></p>
            <span class="num_span">
              x{{item.num}}
            </span>
            <span class="num_span">
              {{item.remark}}
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div class="shopcart_div">

      <div class="remark_div">
        <input type="text" placeholder="备注" id="remark"/>
      </div>
      <div class="result_div" v-if="">
        <span class="result_first_span">合计</span><span class="total_money_span">&yen;{{totalPrice}}</span>
        <span class="signin_span" @click="onDownOrder()">提交订单</span>
        <!--<span v-else="" class="pay_span" @click="onGetOpenWapPay()">-->
          <!--结算-->
        <!--</span>-->
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default{
    name: 'Pay',
    data(){
      return {
//        shopInfo:new Object(),
        tableName: null,
        shopName: null,
        menus: [],
        totalPrice: 0,
        payornot: true
      }
    },
    created(){
      var _this = this;
      console.log(window.localStorage);
      eventBus.$on("PayAttrDeliver", function (val) {
//        _this.shopName=val.data.shopName;
        _this.tableName = val.tableName;
        _this.shopName = val.shopName;
        _this.menus = val.data;
        _this.totalPrice = val.totalPrice;
      });
    },
    methods: {
      goback: function () {
        history.go(-1)
      },
      onDownOrder: function () {
          var _this = this;
        _this.payornot = false;
        var order = [];
        for (var i = 0; i < _this.menus.length; i++) {
          var orderItem = new Object();
          orderItem.foodId = _this.menus[i].id;
          orderItem.foodName = _this.menus[i].name;
          orderItem.qty = _this.menus[i].num;
          orderItem.price = _this.menus[i].weixin;
          orderItem.remark = _this.menus[i].remark;
          orderItem.unit = _this.menus[i].title;
          order.push(orderItem);
        }
        ;
        //做随机的orderId，保证唯一性
        var myDate = new Date();
        var year = myDate.getFullYear();//获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1;
        var date = myDate.getDate();
        var hours = myDate.getHours();
        var minutes = myDate.getMinutes();
        var seconds = myDate.getSeconds();
        var random = Math.floor(Math.random() * (900) + 100);
        var nowDate = year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date) + (hours < 10 ? "0" + hours : hours)
          + (minutes < 10 ? "0" + minutes : minutes) + (seconds < 10 ? "0" + seconds : seconds) + random;
        console.log(year, month, date, hours, minutes, seconds, random, nowDate);
        //var memus = JSON.parse(window.localStorage.getItem("downMenu"));
        var mealsNumbel,employeeId;
        if (JSON.parse(window.localStorage.getItem("isGuest"))){
          mealsNumbel = 1;
          employeeId = 1;
        }else {
          mealsNumbel = JSON.parse(window.localStorage.getItem("requestData")).mealsNumbel;
          employeeId = JSON.parse(window.localStorage.getItem("requestData")).employeeId;
        }
        var remark = document.getElementById("remark").value;
        let requestData = {
          orderInfo: {
            orderId: nowDate,
            remarks: remark,
            shopId: window.localStorage.getItem("shopId"),
            tableId: window.localStorage.getItem("tableId"),
            mealsNumbel:mealsNumbel,
            employeeId: employeeId
          },
          orderItem: order,
        };
        console.log(requestData);
        var qs = require('qs');
        axios.post(
          "/downOrder",
          qs.stringify({
            "jsonData": JSON.stringify(requestData)
          }),
          {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
        )
          .then(function (res) {
            window.location.href = "/saobei/getOpenWapPay?&merchantId="+window.localStorage.getItem("merchantId")+"&shopId="+window.localStorage.getItem("shopId")+"&totalFee=" + _this.totalPrice * 100
              + "&orderId=" + nowDate+"&orderBody="+_this.tableName;
            window.localStorage.clear();
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log(requestData);
        //window.localStorage.clear();
//        console.log(memus);memus
      },
      //支付请求
      onGetOpenWapPay: function () {
        var myDate = new Date();
        var year = myDate.getFullYear();//获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1;
        var date = myDate.getDate();
        var hours = myDate.getHours();
        var minutes = myDate.getMinutes();
        var seconds = myDate.getSeconds();
        var random = Math.floor(Math.random() * (900) + 100);
        var nowDate = year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date) + (hours < 10 ? "0" + hours : hours)
          + (minutes < 10 ? "0" + minutes : minutes) + (seconds < 10 ? "0" + seconds : seconds) + random;
        window.location.href = "/saobei/getOpenWapPay?&merchantId="+window.localStorage.getItem("merchantId")+"&shopId="+window.localStorage.getItem("shopId")+"&totalFee=" + _this.totalPrice * 100
          + "&orderId=" + nowDate;
        window.localStorage.clear();
      }
    }
//    mounted(){
//      var _this = this;
//      eventBus.$on("PayAttrDeliver", function (val) {
////        _this.shopName=val.data.shopName;
//        _this.tableName = val.data.tableName;
//        _this.shopName = val.data.shopName;
//        _this.menus = val.data.menus;
//      });
//    }
  }
</script>
<style scoped>
  .pay_container {
    width: 100%;
    height: 100%;
    margin: 0em;
    padding: 0em;
    display: flex;
    flex-direction: column;
  }

  .top_first {
    background: #353E4C;
    color: #ffffff;
    padding: 1em;
  }

  .top_first span {
    display: inline-block;
    height: inherit;
    font-size: 1em;
    padding: 0.3125em;
    margin: 0em 0.625em 0em 0em;
  }

  .top_first span img {
    vertical-align: middle;
  }

  .shopname_div, .tablename_div {
    width: 94%;
    background: #F4F8F9;
    padding: 0.3125em 3% 0.625em 3%;
  }

  .shopname_div {
    color: #94A4AE;
  }

  .shopname_div span {
    padding: 0.3125em;
    margin: 0em 0.625em 0em 0em;
    /*background: #000000;*/
    display: inline-block;
  }

  .shopname_div span img {
    vertical-align: middle;
  }

  .menu_div {
    width: 100%;
    flex-grow: 1;
    background: #F4F8F9;
    overflow: scroll;
  }

  .shopcart_div {
    width: 100%;
  }

  .menu_div ul {
    list-style: none;
    width: 100%;
    height: 100%;
    padding: 0em;
    margin: 0em;
  }

  .menu_div ul li {
    display: flex;
    background: #ffffff;
    border-bottom: 1px solid #F4F8F9;;
    flex-direction: row;
    padding: 0.625em 0.625em 0.3125em 1em;
  }

  .Img_div {
    /*background: #000000;*/
    width: 20%;
    height: inherit;
  }
  .Img_div img{
    max-width: 100%;
  }

  .menu_list_div {
    padding: 0.3125em 0.625em;
    font-size: 0.875em;
    flex-grow: 1;
  }

  .menu_list_div .menu_name_p {
    margin: 0em;
    width: 100%;
  }

  .menu_list_div .cost_span {
    display: block;
    float: right;
  }

  .num_span {
    display: block;
    float: left;
    font-size: 1em;
    line-height: 1.3125em;
    color: #91A4AD;
    margin-left:1em;
    padding: 0.3125em 0em 0.625em 0em;
  }

  .result_div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, .1);
  }

  .remark_div {
    width: 100%;
  }

  .remark_div input[type="text"] {
    width: 92%;
    /*margin: 0.625em;*/
    padding: 0.875em 4%;
    font-size: 0.875em;
    border: 0em;
  }

  .signin_span {
    color: #ffffff;
    background: #F3712D;
    font-size: 0.875em;
    padding: 1em;
    text-align: center;
    width: 20%;
  }

  .pay_span {
    color: #ffffff;
    background: #62A72A;
    font-size: 0.875em;
    padding: 1em;
    width: 20%;
    text-align: center;
  }

  .result_first_span {
    flex-grow: 1;
    color: #91A4AD;
    font-size: 0.875em;
    padding: 0em 0em 0em 1em;
  }

  .total_money_span {
    flex-grow: 6;
    color: #F3712D;
    font-weight: 600;
  }

</style>
