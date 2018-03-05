<template>
  <div class="container" id="menu_div">
    <div class="topbar">
      <img src="../../assets/goback.png"/>
      <p>{{tableName}}</p>
    </div>
    <div class="titlebar">
      <img src=""/>
      <p>{{shopname}}</p>
    </div>
    <div class="maindiv">
      <div class="navdiv">
        <ul class="category_list">
          <li v-for="(item, index) in goods" v-bind:class="{active:index == num}" @mouseover="toggleRoom(index)">
            <!--<img :src="item.img_url">-->
            {{item.name}}
          </li>
          <!--<li v-for="(item, index) in lists" v-bind:class="{active:index == num}" @mouseover="toggleRoom(index)">-->
          <!--<img :src="item.img_url">-->
          <!--{{item.name + index}}-->
          <!--</li>-->
        </ul>
      </div>
      <div class="food_div">
        <ul class="foods_list">
          <li v-for="(item, index) in goods">{{item.name}}
            <ul class="foodInfo_list">
              <li v-for="(room, index) in item.foods">
                <div class="foodImg_div"></div>
                <div class="food_other_div"><p>{{room.text}}</p>
                  <p class="price_p">&yen;{{room.price}}
                    <span v-on:click="onChooseNorms(room,$event)" class="choose_norm_span">选规格</span></p>
                </div>
              </li>
            </ul>
          </li>
        </ul>
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
          <p>{{food_info.text}}<span @mouseover="onCloseRoom()">
          <img src="../../assets/close_icon.png"></span></p>
        </div>
        <div class="food_center_normInfo">
          <p class="norms_la">规格</p>
          <p><span class="norm_span">小份</span><span class="norm_span">中份</span><span class="norm_span">大份</span></p>
        </div>
        <div class="food_center_normInfo">
          <p>辣度</p>
         <p class="norms_la"><span class="norm_span">微辣</span><span class="norm_span">中辣</span><span class="norm_span">特辣</span></p>
        </div>
        <div class="food_center_price">
          <span>&yen;39.90</span>
          <span>&yen;88</span><span>（微辣）</span>
          <span class="food_center_shopcart_span">
            <img src="../../assets/shopcart_s.png"/>加入购物车</span>
        </div>
      </div>
    </div>
    <div class="shop_carts">
      <div></div>
      <div class="car_price_div"><span class="shop_cartIcon"><span><img
        src="../../assets/shopcart.png"></span></span>
        <p class="price_span">&yen;76.50</p><span class="pay_span">去下单</span></div>
      <div></div>
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
        merchanData: [],
        shopname: null,
        tableName: null,
        goods: [],
        openRoom: [],
        food_info: []
      }
    },

    created(){
      let getData = {
        'mer': '1',
        'sho': '66'
      };
      axios.get('../../../static/respons.json').then((res) => {
        axios.get('../../static/data.json').then((res) => {
          this.goods = res.data.goods;
        });
//        console.log(res);
//        this.merchanData = res.data;
//        this.shopname = res.data.shopname;
//        this.lists = res.data.table;
//        this.rooms = res.data.table[1].shopTableList;
      });
      var _this = this;
      eventBus.$on("AttrDeliver", function (val) {
        _this.tableName = val.tableName;
        _this.shopname = val.data.shopname;
//      this.rooms=lists[0].rooms
      });
    },
    methods: {
      toggleRoom: function (index) {
        this.num = index;
        console.log("我点击了" + index);
      },
      onChooseNorms: function (food, event) {
        document.getElementById("food_norms").setAttribute("class", "dis_foodNormsDiv");
        this.food_info = food;
        console.log(food);
      },
      onRoomOpen: function (room_info) {
        this.openRoom = room_info
        document.getElementById("roomopendiv").setAttribute("class", "display_room");
      },
      onCloseRoom: function () {
        document.getElementById("roomopendiv").setAttribute("class", "no_display_room")
      },
      onOpenDesk: function (event) {
        this.$router.push(
          '/room', 'Room'
        );
        document.getElementById("roomopendiv").setAttribute("class", "no_display_room");
//        var menu_div = document.getElementById("menu_div");
//        menu_div.setAttribute("class", "display_menu")
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
