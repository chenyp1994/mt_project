<template>
  <div class="container">
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
        <ul>
          <li v-for="(item, index) in goods" v-bind:class="{active:index == num}" @mouseover="toggleRoom(index)">
            <!--<img :src="item.img_url">-->
            {{item.name + index}}
          </li>
          <!--<li v-for="(item, index) in lists" v-bind:class="{active:index == num}" @mouseover="toggleRoom(index)">-->
          <!--<img :src="item.img_url">-->
          <!--{{item.name + index}}-->
          <!--</li>-->
        </ul>
      </div>
      <ul>
        <li v-for="(item, index) in goods">{{item.name}}
          <ul>
            <li v-for="(room, index) in item.foods">
              <div>{{room.text}}</div>
              <div>
                <p>&yen;{{room.price}}</p><span v-on:click="onChooseNorms">选规格</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
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
        <div>{{food_info.text}}</div>
        <div><p>规格</p>
          <div><span>小份</span><span>中份</span><span>大份</span></div>
        </div>
        <div><p>辣度</p>
          <div><span>微辣</span><span>中辣</span><span>特辣</span></div>
        </div>
        <div><span>&yen;39.90</span><span>&yen;88</span><span>（微辣）</span><span>加入购物车</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import hall_img from '@/assets/hall.png'
  import room_img from '@/assets/room.png'
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
        console.log("我点击了" + index);
      },
      onChooseNorms: function () {
//        this.food_info = room;
        document.getElementById("food_norms").setAttribute("class", "dis_foodNormsDiv");
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


<!--<template>-->
<!--<div id="menu_div">-->
<!--<div class="topbar">-->
<!--<span @click="ongoback()"><img src="../../assets/goback.png"/></span>-->
<!--<p>{{tableName}}</p>-->
<!--</div>-->
<!--<div class="titlebar">-->
<!--<img src=""/>-->
<!--<p>{{shopname}}</p>-->
<!--</div>-->
<!--<div class="maindiv">-->
<!--<div class="navdiv">-->
<!--<ul>-->
<!--<li v-for="(item, index) in goods" v-bind:class="{active:index == num}" @mouseover="toggleRoom(index)">-->
<!--&lt;!&ndash;<img :src="item.img_url">&ndash;&gt;-->
<!--{{item.name + index}}-->
<!--</li>-->
<!--</ul>-->
<!--</div>-->
<!--<div class="tabcontent">-->
<!--<ul>-->
<!--<li v-for="(item, index) in goods">{{item.name}}-->
<!--<ul>-->
<!--<li v-for="(room, index) in item.foods">-->
<!--<div>{{room.text}}</div>-->
<!--<div>-->
<!--<p>&yen;{{room.price}}</p><span v-on:click="onChooseNorms">选规格</span>-->
<!--</div>-->
<!--</li>-->
<!--</ul>-->
<!--</li>-->
<!--</ul>-->
<!--&lt;!&ndash;<div v-for="(room, index) in goods.foods" v-show="index == num" @mouseover="onRoomOpen(room)">&ndash;&gt;-->
<!--&lt;!&ndash;<div class="roomdiv">&ndash;&gt;-->
<!--&lt;!&ndash;<p>&ndash;&gt;-->
<!--&lt;!&ndash;{{room}}&ndash;&gt;-->
<!--&lt;!&ndash;</p>&ndash;&gt;-->
<!--&lt;!&ndash;</div>&ndash;&gt;-->
<!--&lt;!&ndash;</div>&ndash;&gt;-->
<!--</div>-->
<!--</div>-->
<!--<div id="food_norms" class="foodNormsDiv">-->
<!--<div class="food_center">-->
<!--<div>{{food_info.text}}</div>-->
<!--<div><p>规格</p>-->
<!--<div><span>小份</span><span>中份</span><span>大份</span></div>-->
<!--</div>-->
<!--<div><p>辣度</p>-->
<!--<div><span>微辣</span><span>中辣</span><span>特辣</span></div>-->
<!--</div>-->
<!--<div><span>&yen;39.90</span><span>&yen;88</span><span>（微辣）</span><span>加入购物车</span></div>-->
<!--</div>-->
<!--</div>-->
<!--<div class="shop_carts">-->
<!--<div></div>-->
<!--<div class="car_price_div"><span><img-->
<!--src="../../assets/shopcart.png"></span><span>&yen;76.50</span><span>去下单</span></div>-->
<!--<div></div>-->
<!--</div>-->
<!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import axios from 'axios'-->
<!--export default {-->
<!--name: 'Room',-->
<!--data(){-->
<!--return {-->
<!--goods: [],-->
<!--num: 0,-->
<!--tableName: null,-->
<!--shopname: null,-->
<!--food_info: []-->
<!--}-->
<!--},-->
<!--created(){-->
<!--var _this = this;-->
<!--axios.get('../../static/data.json').then((res) => {-->
<!--this.goods = res.data.goods;-->
<!--});-->
<!--eventBus.$on("AttrDeliver", function (val) {-->
<!--_this.tableName = val.tableName;-->
<!--_this.shopname = val.data.shopname;-->
<!--//        document.getElementById("tableNo").innerText=val.tableName;-->
<!--//        document.getElementById("shopName").innerText=val.tableName;-->
<!--});-->

<!--},-->
<!--methods: {-->
<!--toggleRoom: function (index) {-->
<!--console.log("我点击了" + index);-->
<!--},-->
<!--onChooseNorms: function () {-->
<!--//        this.food_info = room;-->
<!--document.getElementById("food_norms").setAttribute("class", "dis_foodNormsDiv");-->
<!--},-->
<!--ongoback: function () {-->
<!--document.getElementById("menu_div").setAttribute("class", "no_display_menu");-->
<!--}-->
<!--}-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--@import '../../../static/css/room.css';-->
<!--</style>-->
