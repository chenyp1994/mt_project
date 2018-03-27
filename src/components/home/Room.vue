<template>
  <div class="container" id="menu_div">
    <div class="topbar_room">
      <span @click="goback()"><img src="../../assets/back.png"/></span>
      {{tableName}}
    </div>
    <div class="titlebar_room">
      <span><img src="../../assets/shop_color.png"/></span>
      <p>{{shopName}}</p>
    </div>
    <div class="maindiv">
      <div class="navdiv">
        <ul class="category_list">
          <li v-for="(item, index) in goods" v-bind:class="{active:index == num}" @mouseover="toggleRoom(item,index)">
            <!--<img :src="item.img_url">-->
            {{item.name}}
          </li>
          <!--<li v-for="(item, index) in lists" v-bind:class="{active:index == num}" @mouseover="toggleRoom(index)">-->
          <!--<img :src="item.img_url">-->
          <!--{{item.name + index}}-->
          <!--</li>-->
        </ul>
      </div>
      <div class="mainmenu_div">
        <div class="food_div" v-for="(item, index) in menus">
          <div class="menuimg_div"><span></span></div>
          <div class=food_item_div><span class="food_name_span">{{item.name}}</span>
            <p class="money_p">&yen;&nbsp;{{item.cost}}
              <span @click="onChooseNorms(item,$event)" class="norms_span"
                    v-if="item.foodtasetEntity.length!=0">选规格</span>
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

      <!--<div v-for="(room, index) in goods.foods" v-show="index == num" @mouseover="onRoomOpen(room)">-->
      <!--<div class="roomdiv">-->
      <!--<p>-->
      <!--{{room}}-->
      <!--</p>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
    </div>
    <div id="food_norms" class="foodNormsDiv">
      <div class="food_center">
        <div class="foodname_div">
          <p>{{food_info.name}}<span @mouseover="onCloseRoom()">
          <img src="../../assets/close_icon.png"></span></p>
        </div>
        <div class="food_center_normInfo">
          <p class="norms_la">规格</p>
          <ul>
            <li class="norm_span">小份</li>
            <li class="norm_span">中份</li>
            <li class="norm_span">大份</li>
          </ul>
          <!--<p><span class="norm_span">小份</span><span class="norm_span">中份</span><span class="norm_span">大份</span></p>-->
        </div>
        <div class="food_center_laduInfo">
          <!--<p>辣度</p>-->
          <!--<label class="ladu_label"><input type="radio"/>微辣</label>-->
          <span @click="onShowNorms(food_info)" class="taste_select_span">选择口味</span>
          <input type="text" readonly placeholder="这里是选择的口味"/>
          <!--<ul>-->
          <!--<li class="norm_la">微辣</li>-->
          <!--<li class="norm_la">中辣</li>-->
          <!--<li class="norm_la">特辣</li>-->
          <!--</ul>-->
          <!--<p class="norms_la"><span class="norm_span">微辣</span><span class="norm_span">中辣</span><span class="norm_span">特辣</span>-->
          <!--</p>-->
        </div>
        <div class="food_center_price">
          <span class="trueprice_span">&yen;{{food_info.cost}}</span>
          <span class="oriprice_span">&yen;{{food_info.retailPrice}}</span><span class="ladu_span">（微辣）</span>
          <span class="food_center_shopcart_span" @click="onAddFoodItem(food_info)">
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
              <span class="shopcart_money_span">&yen;{{item.cost}}</span>
              <span class="shopcart_count_span">
                <span @click="onReduceFoodItem(item)"><img src="../../assets/minus.png"/></span>
                {{item.num}}
                <span @click="onAddFoodItem(item)"><img src="../../assets/plus.png"/></span>
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
        <span class="pay_span" @click="onRedirectToPay()">去下单</span></div>
    </div>
    <div v-show="isShowNorm" class="taste_div" id="taste_div">
      <div class="taste_center_div">
        <p class="taste_title_p">请选择口味
          <span @click="onCloseTasteDiv()"><img src="../../assets/close_icon.png"></span>
        </p>
        <div class="taste_item_div" id="taste_item_div">
          <label class="ladu_label" v-for="taste_item in tasteEntity">
            <input type="checkbox" name="taste" :value="taste_item.id"/>{{taste_item.taste}}</label>
        </div>
        <div class="taste_btn_div">
          <span @click="onSelectTaste()">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default{
    name: 'Home',
    data(){
      return {
        lists: [],
        num: 0,
        shopName: null,
        tableName: null,
        goods: [],
        menus: [],//菜单的总列表
        openRoom: [],
        food_info: [],//点击菜单弹出窗口信息
        foodNums: 0,//购物车的总数
        isShop: true,
        menuItem: new Array(),//购物车里的菜单
        isShowNorm: false,
        tasteEntity: [],
        selectedTaste: [],
        totalPrice: 0
      }
    },

    mounted(){

    },
    created(){
      var _this = this;
      _this.goods = JSON.parse(window.localStorage.getItem("AllData")).goods;
      for (var m = 0; m < _this.goods.length; m++) {
        for (var i = 0; i < _this.goods[m].foods.length; i++) {
          _this.goods[m].foods[i].num = 0;
        }
      }
      _this.menus = _this.goods[_this.num].foods;
      _this.shopName = JSON.parse(window.localStorage.getItem("AllData")).shopname;
      _this.tableName = window.localStorage.getItem("tableName");
      console.log(window.localStorage);
      if (window.localStorage.length > 2) {
        _this.menus = JSON.parse(window.localStorage.getItem("menus"));
        _this.menuItem = JSON.parse(window.localStorage.getItem("downMenu"));
        _this.totalPrice = JSON.parse(window.localStorage.getItem("totalPrice"));
        _this.foodNums = window.localStorage.getItem("menusNum");
      }
//
//      if (_this.tableName != window.localStorage.getItem("tableName")) {
//        _this.tableName = window.localStorage.getItem("tableName");
//      }
//      if (_this.menuItem != window.localStorage.getItem("downMenu")) {
//        _this.menuItem = window.localStorage.getItem("downMenu");
//      }

      eventBus.$on("AttrDeliver", function (val) {
        _this.tableName = val.tableName;
        window.localStorage.removeItem("tableName");
        window.localStorage.setItem("tableName", _this.tableName);
      });
    },

    beforeDestroy()
    {
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
      window.localStorage.removeItem("downMenu");
      window.localStorage.setItem("downMenu", JSON.stringify(_this.menuItem));//菜单
      window.localStorage.removeItem("menus");
      window.localStorage.setItem("menus", JSON.stringify(_this.menus));//选择过的完整菜单
      window.localStorage.removeItem("menusNum");
      window.localStorage.setItem("menusNum", _this.foodNums);//菜单数量
      window.localStorage.removeItem("totalPrice");
      window.localStorage.setItem("totalPrice", JSON.stringify(_this.totalPrice));
    },

//    destroyed(){
//      eventBus.$emit("PayAttrDeliver", {tableName:this.tableName,shopName:this.shopName,data: this.menuItem});
////      eventBus.$off("PayAttrDeliver");
//    },
    methods: {
      toggleRoom: function (foods, index) {
//        var _this = this;
        this.num = index;
        this.menus = foods.foods;
//        for (var i = 0; i < _this.menus.length; i++) {
//          _this.menus[i].num = 0;
//        }
        console.log(this.menus);
      },
      onChooseNorms: function (food, event) {
        document.getElementById("food_norms").setAttribute("class", "dis_foodNormsDiv");
        this.food_info = food;
//        console.log(food);
      },
      onCloseRoom: function () {
        document.getElementById("food_norms").setAttribute("class", "nodis_foodNormsDiv");
      },

      //规格窗口里的加入购物车的方法
      onAddFood: function (food_info) {
        this.foodNums++;
        food_info.num++;
        this.totalPrice += food_info.cost;
        var menuitem;
        menuitem = JSON.parse(JSON.stringify(food_info));
        this.menuItem.push(menuitem);
//        console.log(this.menuItem);
        document.getElementById("food_norms").setAttribute("class", "nodis_foodNormsDiv");
      }
      ,
      //点击选规格按钮后的加号按钮方法
      onAddFoodItem: function (fooditem) {
        this.foodNums++;
        this.totalPrice += fooditem.cost;
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
        }
        else {
          this.menuItem[isSameid].num++;
        }
        console.log(this.menuItem, isSameid);
      },

      onReduceFoodItem: function (food_info) {
        var _this = this;
        food_info.num--;
        console.log(food_info.num, 1);
        var isSameID = _this.menus.findIndex(x => x.id == food_info.id);
        var shopItemId = _this.menuItem.findIndex(x => x.id == food_info.id);
        _this.menuItem[shopItemId].num = food_info.num;
        _this.menus[isSameID].num = food_info.num;
        console.log(shopItemId, food_info.num, 2);
//        _this.menuItem[shopItemId].num--;
        if (_this.menuItem[shopItemId].num == 0) {
          _this.menuItem.splice(shopItemId, 1);
          console.log(food_info.num, 3);
        }
        console.log(food_info.num, 4);
        _this.totalPrice -= food_info.cost;
        _this.foodNums--;
        console.log(food_info.num, 5);
//        _this.menus[isSameID].num--;
      },
      onDisplayShop: function (isShop, e) {
        var shopcls = isShop ? "display_shop" : "no_display_shop";
        var height = isShop ? "fullheight" : "autoheight";
        document.getElementById("shopItem").setAttribute("class", shopcls);
        document.getElementById("shop_carts").setAttribute("class", height);
        this.isShop = !isShop;
      },
      //显示菜品口味，多选
      onShowNorms: function (food_info) {
        this.tasteEntity = food_info.foodtasetEntity;
        this.isShowNorm = true;
        console.log(food_info);
      },

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
        this.foodNums = 0;
        this.totalPrice = 0;
      },

      //关闭口味选择窗口
      onCloseTasteDiv: function () {
        this.isShowNorm = false;
      },

      //选择口味操作
      onSelectTaste: function () {
        var tasteList = document.getElementsByName('taste');
        var taste = new Array();
        var tasteArr = new Object();
        for (var i = 0; i < tasteList.length; i++) {
          if (tasteList[i].checked)
            tasteArr.value = tasteList[i].value;
          tasteArr.id = tasteList[i].innerText;
          taste.push(tasteArr);
        }
        console.log(tasteList, taste);
        this.isShowNorm = false;
        this.selectedTaste = taste;
      },
      onRedirectToPay: function () {
        this.$router.push(
          '/pay', 'Pay'
        );
      }
    },
  }
</script>
<style scoped>
  /**{*/
  /*height: 100%;*/
  /*}*/
  @import '../../../static/css/room.css';

</style>
