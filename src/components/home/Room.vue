<template>
  <div class="container" id="menu_div">
    <div class="topbar_room">
      <span @click="goback()"><img src="../../assets/back.png"/></span>
      {{tableName}}
    </div>
    <!--<div class="titlebar_room">-->
    <!--<span><img src="../../assets/shop_color.png"/></span>-->
    <!--<p>{{shopName}}</p>-->
    <!--</div>-->
    <div class="maindiv">
      <div class="navdiv">
        <ul class="category_list">
          <li v-for="(item,index) in goods" v-bind:class="{active:index == num}"
              @mouseover="toggleRoom(item,index)">
            <!--<img :src="item.img_url">-->
            {{item.foodCategory}}
            <span class="selectedNum_span" v-show="item.seletedNum">
          {{item.seletedNum}}
        </span>
          </li>
          <!--<li v-for="(item, index) in lists" v-bind:class="{active:index == num}" @mouseover="toggleRoom(index)">-->
          <!--<img :src="item.img_url">-->
          <!--{{item.name + index}}-->
          <!--</li>-->
        </ul>
      </div>
      <div class="mainmenu_div">
        <div class="food_div" v-for="(item, index) in menus">
          <div class="menuimg_div"><span><img :src="'http://113.105.152.179:8080/foodimage/png/'+item.avator"/></span>
          </div>
          <div class=food_item_div><span class="food_name_span">{{item.name}}</span>
            <p class="money_p">&yen;&nbsp;{{item.weixin}}
              <span @click="onChooseNorms(item,$event)" class="norms_span"
                    v-if="item.foodtasetEntity.length!=0 ||item.foodsize.length!=0">选规格</span>
              <span v-else="" class="food_nums_count_span">
                <span @click="onReduceFoodItem(item)" v-show="item.num"><img
                  src="../../assets/minus.png"/></span>
                <span v-show="item.num">{{item.num}}</span>

                <span @click="onAddFoodItem(item)"><img src="../../assets/plus.png"/></span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div id="food_norms" class="foodNormsDiv">
      <div class="food_center">
        <div class="foodname_div">
          <p>{{food_info.name}}<span @mouseover="onCloseRoom()">
          <img src="../../assets/close_icon.png"></span></p>
        </div>
        <div class="taste_item_div" id="size_item_div">
          <p class="norms_la">规格</p>
          <label class="ladu_label" v-for="size_item in food_info.foodsize">
            <input type="radio" name="size" :value="size_item.title" lazy
                   @change="onSelectedSize(size_item)"/>{{size_item.title}}</label>
        </div>
        <div class="food_center_laduInfo">
          <p class="norms_la">口味</p>
          <label class="ladu_label" v-for="taste_item in food_info.foodtasetEntity">
            <input type="radio" name="tasteEntity" :value="taste_item.name"/>{{taste_item.name}}</label>
        </div>
        <div class="food_center_price">
          <span class="trueprice_span">&yen;{{food_info.weixin}}</span>
          <span class="oriprice_span">&yen;{{food_info.retailPrice}}</span>
          <span class="ladu_span">{{food_info.remark
            }}</span>
          <span class="food_center_shopcart_span" @click="onAddFood(food_info)">
            <img src="../../assets/shopcart_s.png"/>加入购物车</span>
        </div>
      </div>
    </div>
    <div class="shop_carts autoheight" id="shop_carts">
      <div id="shopItem" class="no_display_shop">
        <div class="shopItemDetail" @click="onDisplayShop(isShop,$event)">
          <p><span class="shop_name_span">购物车</span><span class="clear_span" @click="onClearShop()"><img
            src="../../assets/clear.png"/>清空</span></p>
          <ul>
            <li v-for="item in menuItem">
              <span class="shopcart_name_span">{{item.name}}</span>
              <span class="shopcart_money_span">&yen;{{item.weixin}}</span>
              <span class="shopcart_count_span">
                <span @click="onReduceFoodItem(item)"><img src="../../assets/minus.png"/></span>
                {{item.num}}
                <span @click="onAddFoodItem(item,$event)"><img src="../../assets/plus.png"/></span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="car_price_div">
        <span class="shop_cartIcon" @click="onDisplayShop(isShop)">
          <span class="food_1" v-show="foodNums">
          {{foodNums}}
        </span>
        <span><img
          src="../../assets/shopcart.png"></span></span>
        <p class="price_span" @click="onDisplayShop(isShop)">&yen;{{totalPrice}}</p>
        <span class="pay_span" @click="onRedirectToPay()" v-if="foodNums">去下单</span>
        <span class="pay_span_gray" v-else="">去下单</span>
        <!--<span class="pay_span" @click="onPay()" v-else="">结算</span>-->
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Home",
    data() {
      return {
        lists: [],
        num: 0,
        shopName: null,
        tableName: null,
        goods: [],
        categoryName: [],
        menus: [], //菜单的总列表
        openRoom: [],
        food_info: [], //点击菜单弹出窗口信息
        foodNums: 0, //购物车的总数
        isShop: true,
        menuItem: [], //购物车里的菜单
        isShowNorm: false,
        tasteEntity: [],
        foodsize: [],
        selectedTaste: [],
        totalPrice: 0,
        isGuest: 0,
//        openFoodInfo:[]//这个是打开选规格窗口的数据
      };
    },

    watch: {
      menuItem: function (val, oldVal) {
        console.table(val, oldVal);
      }
    },
    created() {
      var _this = this;
      _this.isGuest = JSON.parse(window.localStorage.getItem("isGuest"));
      //getfoodbytable ../static/respons.json

      if (window.localStorage.length <= 4) {
        if (JSON.parse(window.localStorage.getItem("isGuest"))) {
          axios.get("/getfoodbytable",
            {
              params: {
                mer: window.localStorage.getItem("merchantId"),
                sho: window.localStorage.getItem("shopId"),
                tab: window.localStorage.getItem("tableId")
              }
            }
          )
            .then(function (res) {
              if (res.data.foodlist.length == 0) {
                alert("该店铺相关数据为空");
              } else {
                _this.menus = res.data.foodlist[0].foods;
                document.title = res.data.shopname;
                _this.goods = res.data.foodlist;
                _this.tableName = res.data.tablename;
                for (var m = 0; m < _this.goods.length; m++) {
                  _this.goods[m].seletedNum = 0;
                  if (_this.goods[m].foods == null) {
                    continue;
                  } else {
                    for (var i = 0; i < _this.goods[m].foods.length; i++) {
                      _this.goods[m].foods[i].num = 0;
                      if (_this.goods[m].foods[i].foodtasetEntity == null) {
                        _this.goods[m].foods[i].foodtasetEntity = [];
                      } else {
                        continue;
                      }
                    }
                  }
                }
                ;
                console.log(_this.goods);
              }
            });
        } else {
          eventBus.$on("AttrDeliver", function (val) {
            _this.tableName = val.tableName;
            window.localStorage.removeItem("tableName");
            window.localStorage.setItem("tableName", _this.tableName);
            _this.goods = JSON.parse(window.localStorage.getItem("AllData"));
            for (var m = 0; m < _this.goods.length; m++) {
              for (var i = 0; i < _this.goods[m].foods.length; i++) {
                _this.goods[m].foods[i].num = 0;
              }
            }
            _this.menus = _this.goods[0].foods;
          });
        }
      } else {
        // _this.menus = JSON.parse(window.localStorage.getItem("menus"));
        _this.menuItem = JSON.parse(window.localStorage.getItem("downMenu"));
        _this.totalPrice = JSON.parse(window.localStorage.getItem("totalPrice"));
        _this.foodNums = window.localStorage.getItem("menusNum");
        _this.goods = JSON.parse(window.localStorage.getItem("AllData"));
        _this.tableName = (window.localStorage.getItem("tableName"));
        _this.menus = _this.goods[0].foods;
      }
    },
    beforeDestroy() {
      var _this = this;
      var shopInfo = new Object();
      shopInfo.shopName = _this.shopName;
      shopInfo.tableName = _this.tableName;
      //      alert(_this.shopName);
      eventBus.$emit("PayAttrDeliver", {
        tableName: _this.tableName,
        shopName: _this.shopName,
        totalPrice: _this.totalPrice,
        data: _this.menuItem
      });
      window.localStorage.removeItem("AllData");
      window.localStorage.setItem("AllData", JSON.stringify(_this.goods));
      window.localStorage.removeItem("downMenu");
      window.localStorage.setItem("downMenu", JSON.stringify(_this.menuItem)); //购物车里面的菜单
      window.localStorage.removeItem("menus");
      window.localStorage.setItem("menus", JSON.stringify(_this.menus)); //选择过的完整菜单
      window.localStorage.removeItem("menusNum");
      window.localStorage.setItem("menusNum", _this.foodNums); //菜单数量
      window.localStorage.removeItem("totalPrice");
      window.localStorage.setItem("totalPrice", JSON.stringify(_this.totalPrice));
      window.localStorage.removeItem("tableName");
      window.localStorage.setItem("tableName", JSON.stringify(_this.tableName));
    },
    //    destroyed(){
    //      eventBus.$emit("PayAttrDeliver", {tableName:this.tableName,shopName:this.shopName,data: this.menuItem});
    ////      eventBus.$off("PayAttrDeliver");
    //    },
    methods: {
      toggleRoom: function (foods, index) {
        //        var _this = this;
//        var menu = new Object();
//        menu.item = foods.foods;
        this.num = index;
        this.menus = foods.foods;
        //        for (var i = 0; i < _this.menus.length; i++) {
        //          _this.menus[i].num = 0;
        //        }
        console.log(this.menus);
      },
      onChooseNorms: function (food, event) {
        var data = new Object();
        data.id = food.id;
        data.name = food.name;
        data.num = food.num;
        data.weixin = food.weixin;
        data.foodsize = food.foodsize;
        data.foodtasetEntity = food.foodtasetEntity;
        data.avator = food.avator;
        data.retailPrice = food.retailPrice;
        data.categoryname = food.categoryname;
        data.title = food.title;

        document
          .getElementById("food_norms")
          .setAttribute("class", "dis_foodNormsDiv");
        this.food_info = data;
      },
      onCloseRoom: function () {
        document
          .getElementById("food_norms")
          .setAttribute("class", "nodis_foodNormsDiv");
      },
      //规格窗口里的加入购物车的方法
      onAddFood: function (fooditem) {
        var _this = this;
        var arr = new Object();
        arr.remark = "";
        arr.id = fooditem.id;
        arr.weixin = _this.food_info.weixin;
        arr.foodsize = fooditem.foodsize;
        arr.foodtasetEntity = fooditem.foodtasetEntity;
        arr.num = 0;
        arr.name = fooditem.name;
        arr.avator = fooditem.avator;
        arr.categoryname = fooditem.categoryname;
        arr.title = fooditem.title;
        var cateNum = _this.goods.findIndex(x => x.foodCategory == arr.categoryname);
        if (cateNum == -1) {
          alert("返回菜单项的大类菜单名为空");
        } else {
          _this.goods[cateNum].seletedNum++;
        }
        if (
          arr.foodsize.length != 0 ||
          arr.foodtasetEntity.length != 0
        ) {
          var sizeCheckbox = document.getElementsByName("size");
          var tasteCheckbox = document.getElementsByName("tasteEntity");
          if (sizeCheckbox != null)
            for (var i = 0; i < sizeCheckbox.length; i++) {
              if (sizeCheckbox[i].checked) {
                arr.remark = sizeCheckbox[i].value + ",";
                sizeCheckbox[i].checked = false;
              } else {
                continue;
              }
            }

          if (tasteCheckbox != null) {
            for (var j = 0; j < tasteCheckbox.length; j++) {
              if (tasteCheckbox[j].checked) {
                arr.remark += tasteCheckbox[j].value;
              } else {
                continue;
              }
            }
          }
        }
        console.log(2, arr.remark, _this.menuItem);
        _this.foodNums++;
        var price = parseFloat(arr.weixin);
        _this.totalPrice = parseFloat(_this.totalPrice);
        _this.totalPrice += price;
        _this.totalPrice = _this.totalPrice.toFixed(2);
        //找口味一样的菜单
        var isSameid = _this.menuItem.findIndex(x => x.id == arr.id);
        var isSameTaste;
        if (isSameid == -1) {
          arr.num++;
          _this.menuItem.push(arr);
          console.log(6, arr, _this.menuItem);
        } else {
          if (arr.remark === _this.menuItem[isSameid].remark) {
            _this.menuItem[isSameid].num++;
            console.log(7, _this.menuItem);
          } else {
            arr.num++;
            _this.menuItem.push(arr);
//            _this.menuItem[isSameid].num++;
            console.log(8, _this.menuItem);
          }
        }
        console.log(9, _this.menuItem);
        //        console.log(this.menuItem);

        document
          .getElementById("food_norms")
          .setAttribute("class", "nodis_foodNormsDiv");
      },
      //点击选规格按钮后的加号按钮方法
      onAddFoodItem: function (fooditem) {
        this.foodNums++;
        //找一样菜单大类名字，然后数字加一
        var cateNum = this.goods.findIndex(x => x.foodCategory == fooditem.categoryname);
        if (cateNum == -1) {
          alert("菜单项对应的大类菜单名称为空");
        } else {
          this.goods[cateNum].seletedNum++;
        }
        console.log(this.goods.seletedNum);
        var price = parseFloat(fooditem.weixin);
        this.totalPrice = parseFloat(this.totalPrice);
        this.totalPrice += price;
        this.totalPrice = this.totalPrice.toFixed(2);
        //找id一样的菜单
        var isSameid = this.menuItem.findIndex(x => x.id == fooditem.id);

        var isSameTaste;
        //        if (fooditem.nums == undefined) {
        //          fooditem.nums = 1;
        //        } else {
        //          fooditem.nums++;
        //        };
        if (isSameid == -1) {
          fooditem.num++;
          this.menuItem.push(fooditem);
        } else {
          this.menuItem[isSameid].num++;
        }
        console.log(this.menuItem, isSameid);
      },
      onReduceFoodItem: function (fooditem_reduce) {
        var _this = this;
        var cateNum = _this.goods.findIndex(x => x.foodCategory == fooditem_reduce.categoryname);
        if (cateNum == -1) {
          alert("返回数据的菜单名为空");
        } else {
          _this.goods[cateNum].seletedNum--;
        }
        fooditem_reduce.num--;
        var isSameID = _this.menus.findIndex(x => x.id == fooditem_reduce.id);
        var shopItemId = _this.menuItem.findIndex(x => x.id == fooditem_reduce.id);
        _this.menuItem[shopItemId].num = fooditem_reduce.num;
        _this.menus[isSameID].num = fooditem_reduce.num;
        // console.log(shopItemId, fooditem_reduce.num, 2);
        //        _this.menuItem[shopItemId].num--;
        if (_this.menuItem[shopItemId].num == 0) {
          _this.menuItem.splice(shopItemId, 1);
          // console.log(fooditem_reduce.num, 3);
        }
        // console.log(fooditem_reduce.num, 4);
        var price = parseFloat(fooditem_reduce.weixin);
        _this.totalPrice = parseFloat(_this.totalPrice);
        _this.totalPrice -= price;
        _this.totalPrice = _this.totalPrice.toFixed(2);
        _this.foodNums--;
        // console.log(fooditem_reduce.num, 5);
        //        _this.menus[isSameID].num--;
      },

      //选择规格对应价钱
      onSelectedSize: function (size_item) {
        var price = size_item.weixin;
        this.food_info.weixin = price;
//        console.log(this.food_info, this.menuItem);
//        var sizeCheckbox = document.getElementsByName("size");
//        var tasteCheckbox = document.getElementsByName("tasteEntity");
//        if (sizeCheckbox != null)
//          for (var i = 0; i < sizeCheckbox.length; i++) {
//            if (sizeCheckbox[i].checked) {
//              this.food_info.remark = sizeCheckbox[i].value + ",";
//            } else {
//              continue;
//            }
//          }
//        if (tasteCheckbox != null) {
//          for (var j = 0; j < tasteCheckbox.length; j++) {
//            if (tasteCheckbox[j].checked) {
//              this.food_info.remark += tasteCheckbox[j].value;
//            } else {
//              continue;
//            }
//          }
//        }
      },
      onDisplayShop: function (isShop, e) {
        var shopcls = isShop ? "display_shop" : "no_display_shop";
        var height = isShop ? "fullheight" : "autoheight";
        document.getElementById("shopItem").setAttribute("class", shopcls);
        document.getElementById("shop_carts").setAttribute("class", height);
        this.isShop = !isShop;
      },
      //显示菜品口味，多选
//      onShowNorms: function (food_info) {
//        this.tasteEntity = food_info.foodtasetEntity;
//        this.foodsize = food_info.foodsize;
//        this.isShowNorm = true;
//        console.log(food_info);
//      },
      //清空购物车
      onClearShop: function () {
        this.menuItem.splice(0, this.menuItem.length);
        for (var i = 0; i < this.menus.length; i++) {
          if (this.menus[i].num != 0) {
            this.menus[i].num = 0;
          } else {
            continue;
          }
        }
        for (var j= 0;j<this.goods.length;j++){
          this.goods[j].seletedNum = 0;
        };
        this.foodNums = 0;
        this.totalPrice = 0;
      },
      //关闭口味选择窗口
      onCloseTasteDiv: function () {
        this.isShowNorm = false;
      },
      //选择口味操作
      onSelectTaste: function () {
        var tasteList = document.getElementsByName("taste");
        var taste = new Array();
        var tasteArr = new Object();
        for (var i = 0; i < tasteList.length; i++) {
          if (tasteList[i].checked) tasteArr.value = tasteList[i].value;
          tasteArr.id = tasteList[i].innerText;
          taste.push(tasteArr);
        }
        console.log(tasteList, taste);
        this.isShowNorm = false;
        this.selectedTaste = taste;
      },
      onRedirectToPay: function () {
//      if (this.menuItem.length == 0) {
//        alert("请先选择餐品再进行结算");
//      } else {
        this.$router.push("/pay", "Pay");
//      }
      },
      //扫码直接结算
      onPay() {
        var order = [];
        for (var i = 0; i < this.menus.length; i++) {
          var orderItem = new Object();
          orderItem.foodId = this.menus[i].id;
          orderItem.foodName = this.menus[i].name;
          orderItem.qty = this.menus[i].num;
          orderItem.price = this.menus[i].weixin;
          orderItem.remark = this.menus[i].remark;
          order.push(orderItem);
        }
        //做随机的orderId，保证唯一性
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1;
        var date = myDate.getDate();
        var hours = myDate.getHours();
        var minutes = myDate.getMinutes();
        var seconds = myDate.getSeconds();
        var random = Math.floor(Math.random() * 900 + 100);
        var nowDate =
          year +
          (month < 10 ? "0" + month : month) +
          (date < 10 ? "0" + date : date) +
          (hours < 10 ? "0" + hours : hours) +
          (minutes < 10 ? "0" + minutes : minutes) +
          (seconds < 10 ? "0" + seconds : seconds) +
          random;
        console.log(year, month, date, hours, minutes, seconds, random, nowDate);
        //var memus = JSON.parse(window.localStorage.getItem("downMenu"));
        var mealsNumbel, employeeId;
        if (JSON.parse(window.localStorage.getItem("isGuest"))) {
          mealsNumbel = 1;
          employeeId = 1;
        } else {
          mealsNumbel = JSON.parse(window.localStorage.getItem("requestData"))
            .mealsNumbel;
          employeeId = JSON.parse(window.localStorage.getItem("requestData"))
            .employeeId;
        }
        // var remark = document.getElementById("remark").value;
        let requestData = {
          orderInfo: {
            orderId: nowDate,
            remark: "",
            shopId: window.localStorage.getItem("shopId"),
            tableId: window.localStorage.getItem("tableId"),
            mealsNumbel: mealsNumbel,
            employeeId: employeeId
          },
          orderItem: order
        };
        console.log(requestData);
        var qs = require("qs");
        axios
          .post(
            "/downOrder",
            qs.stringify({
              jsonData: JSON.stringify(requestData)
            }),
            {headers: {"Content-Type": "application/x-www-form-urlencoded"}}
          )
          .then(function (res) {
            var myDate = new Date();
            var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            var month = myDate.getMonth() + 1;
            var date = myDate.getDate();
            var hours = myDate.getHours();
            var minutes = myDate.getMinutes();
            var seconds = myDate.getSeconds();
            var random = Math.floor(Math.random() * 900 + 100);
            var nowDate =
              year +
              (month < 10 ? "0" + month : month) +
              (date < 10 ? "0" + date : date) +
              (hours < 10 ? "0" + hours : hours) +
              (minutes < 10 ? "0" + minutes : minutes) +
              (seconds < 10 ? "0" + seconds : seconds) +
              random;
            window.location.href =
              "/saobei/getOpenWapPay?&merchantId=" +
              window.localStorage.getItem("merchantId") +
              "&shopId=" +
              window.localStorage.getItem("shopId") +
              "&totalFee=" +
              window.localStorage.getItem("totalPrice") * 100 +
              "&orderId=" +
              nowDate;
            window.localStorage.clear();
            //              alert(res);
            //            axios.get("/saobei/getOpenWapPay", {
            //              params: {
            //                merchantId: 35,
            //                shopId: 72,//window.localStorage.getItem("ShopId"),
            //                totalFee: window.localStorage.getItem("totalPrice") * 100,//以分为单位
            //                orderId: nowDate
            //              }
            //            })
            //              .then(function (res) {
            //                  alert(res);
            ////                  console.log(res);
            //              })
            //              .catch(function (error) {
            //                alert(error);
            //              });
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log(requestData);
        //window.localStorage.clear();
        //        console.log(memus);memus
      }
    }
  };
</script>
<style scoped>
  /**{*/
  /*height: 100%;*/
  /*}*/
  @import "../../../static/css/room.css";
</style>
