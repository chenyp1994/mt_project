<template>
  <div class="container" id="menu_div">
    <div class="topbar_room">
      <img src="../../assets/goback.png"/>
      <p>{{tableName}}</p>
    </div>
    <div class="titlebar_room">
      <img src=""/>
      <p>{{shopname}}</p>
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
          <div class="menuimg_div"></div>
          <div class=food_item_div><span class="food_name_span">{{item.name}}</span>
            <p class="money_p">&yen;&nbsp;{{item.cost}}
              <span @click="onChooseNorms(item,$event)" class="norms_span"
                    v-if="item.foodtasetEntity.length!=0">选规格</span>
              <span v-else="" class="food_nums_count_span">
                <span @click="onReduceFoodItem(item)"><img src="../../assets/minus.png"/></span>
                {{item.num}}
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
          <input type="text" readonly/>
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
          <span class="food_center_shopcart_span" @click="onAddFood(food_info)">
            <img src="../../assets/shopcart_s.png"/>加入购物车</span>
        </div>
      </div>
    </div>
    <div class="shop_carts autoheight" id="shop_carts">
      <div id="shopItem" class="no_display_shop" @click="onDisplayShop(isShop,$event)">
        <div class="shopItemDetail">
          <p><span class="shop_name_span">购物车</span><span class="clear_span"><img
            src="../../assets/clear.png"/>清空</span></p>
          <ul>
            <li v-for="item in menuItem">
              {{item.name}}
              <span>&yen;{{item.cost}}</span>
              <span class="food_nums_count_span">
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
        <p class="price_span" @click="onDisplayShop(isShop)">&yen;76.50</p>
        <span class="pay_span" @click="onRedirectToPay()">去下单</span></div>
    </div>
    <div v-show="isShowNorm" class="taste_div" id="taste_div">
      <div class="taste_center_div">
        <p class="taste_title_p">请选择口味
          <span @click="onCloseTasteDiv()"><img src="../../assets/close_icon.png"></span>
        </p>
        <div class="taste_item_div" id="taste_item_div">
          <label class="ladu_label" v-for="taste_item in tasteEntity">
            <input type="checkbox" name="taste" :value=taste_item.id />{{taste_item.taste}}</label>
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
        num: 1,
        shopname: null,
        tableName: null,
        goods: [],
        menus: [],
        openRoom: [],
        food_info: [],
        foodNums: 0,
        isShop: true,
        shop_menu: [],
        menuItem: new Array(),
        isShowNorm: false,
        tasteEntity: [],
        selectedTaste: []
      }
    },

    created(){
      let getData = {
        'mer': '1',
        'sho': '66'
      };
//      axios.get('../../../static/respons.json').then((res) => {
//        axios.get('../../static/data.json').then((res) => {
//          this.goods = res.data.goods;
//        });
//        console.log(res);
//        this.merchanData = res.data;
//        this.shopname = res.data.shopname;
//        this.lists = res.data.table;
//        this.rooms = res.data.table[1].shopTableList;
//      });
      var _this = this;
      eventBus.$on("AttrDeliver", function (val) {
        _this.tableName = val.tableName;
        _this.shopname = val.data.shopname;
        _this.goods = val.data.goods;
        _this.menus = val.data.goods[0].foods;
        for (var m = 0; m < _this.goods.length; m++) {
          for (var i = 0; i < _this.goods[m].foods.length; i++) {
            _this.goods[m].foods[i].num = 0;
          }
        }
      });
    },

    beforeDestroy (){
      eventBus.$emit("PayAttrDeliver", {tableName: this.tableName, shopName: this.shopname, menus: this.menuItem});
    },
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
        var menuitem;
//        this.shop_menu.push(shop_menu);
        menuitem = JSON.parse(JSON.stringify(food_info));
        this.menuItem.push(menuitem);
        console.log(this.menuItem);
        document.getElementById("food_norms").setAttribute("class", "nodis_foodNormsDiv");
      },
      //点击选规格按钮后的加号按钮方法
      onAddFoodItem: function (fooditem) {
        this.foodNums++;

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
        food_info.num--;
        this.menuItem = JSON.parse(JSON.stringify(food_info));
        this.menuItem.num = this.foodNums;
        var isSameID = this.menus.findIndex(x => x.id == food_info.id);
        if (isSameID !== -1) {
          this.foodNums--;
          this.menus[isSameID].num--;
        }
        else {
          return
        }
        console.log(this.menuItem);
      },

      onDisplayShop: function (isShop) {
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
    }
  }
</script>
<style scoped>
  /**{*/
  /*height: 100%;*/
  /*}*/
  @import '../../../static/css/room.css';

</style>
