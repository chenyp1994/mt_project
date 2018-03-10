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
              <span @click="onChooseNorms(item,$event)" class="norms_span" v-if="foodNums==0">选规格</span>
              <span v-else="" class="food_nums_count_span">
                <span @click="onReduceFoodItem()"><img src="../../assets/minus.png"/></span>
                {{foodNums}}
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
          <p><span class="norm_span">小份</span><span class="norm_span">中份</span><span class="norm_span">大份</span></p>
        </div>
        <div class="food_center_normInfo">
          <p>辣度</p>
          <p class="norms_la"><span class="norm_span">微辣</span><span class="norm_span">中辣</span><span class="norm_span">特辣</span>
          </p>
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
            <li>
              小米金瓜粥<span></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="car_price_div">
        <span class="shop_cartIcon" @click="onDisplayShop(isShop)">
          <span :class="'food_'+foodNums">
          {{foodNums}}
        </span>
        <span><img
          src="../../assets/shopcart.png"></span></span>
        <p class="price_span" @click="onDisplayShop(isShop)">&yen;76.50</p>
        <span class="pay_span" @click="onRedirectToPay()">去下单</span></div>
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
        menuItem:[]
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
      _this.menuItem.num = 0;
      eventBus.$on("AttrDeliver", function (val) {
        _this.tableName = val.tableName;
        _this.shopname = val.data.shopname;
        _this.goods = val.data.goods;
        _this.menus = val.data.goods[0].foods;
//      this.rooms=lists[0].rooms
      });
    },

    beforeDestroy (){
      eventBus.$emit("PayAttrDeliver", {tableName: this.tableName, shopName: this.shopname});
    },
    methods: {
      toggleRoom: function (foods, index) {
//        var _this = this;
        this.num = index;
        this.menus = foods.foods;
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
      onAddFood: function (menu) {
        this.foodNums++;
        this.menuItem.num++;
        this.shop_menu.push(shop_menu);
        console.log(this.foodNums);
        document.getElementById("food_norms").setAttribute("class", "nodis_foodNormsDiv");
      },
      //点击选规格按钮后的加号按钮方法
      onAddFoodItem: function (fooditem) {
        this.foodNums++;
        if (fooditem.nums == undefined) {
          fooditem.nums = 1;
        } else {
          fooditem.nums++;
        }
        this.shop_menu.push(fooditem);
        console.log(fooditem)
      },

      onReduceFoodItem: function () {
        this.foodNums--;
      },

      onDisplayShop: function (isShop) {
        var shopcls = isShop ? "display_shop" : "no_display_shop";
        var height = isShop ? "fullheight" : "autoheight";
        document.getElementById("shopItem").setAttribute("class", shopcls);
        document.getElementById("shop_carts").setAttribute("class", height);
        this.isShop = !isShop;
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
