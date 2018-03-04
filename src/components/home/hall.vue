<template>
  <div class="container">
    <div class="topbar">
      <img src="../../assets/goback.png"/>
      <p>7号桌</p>
    </div>
    <div class="titlebar">
      <img src=""/>
      <p>金拱门（南山店）</p>
    </div>
    <div class="maindiv">
      <div class="navdiv">
        <ul>
          <li v-for="(item, index) in goods" v-bind:class="{active:index == num}" @mouseover="toggle(index)">
            <!--<img :src="item.img_url">-->
            {{item.name + index}}
          </li>
        </ul>
      </div>
      <div class="tabcontent">
        <ul>
          <li v-for="(item, index) in goods">{{item.name}}
            <ul>
              <li v-for="(room, index) in item.foods">
                <div>{{room.text}}</div>
                <div>
                  <p>&yen;{{room.price}}</p><span @click="onChooseNorms(room)">选规格</span>
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
      </div>
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
    <div class="shop_carts">
      <div></div>
      <div class="car_price_div"><span></span><span>&yen;76.50</span><span></span></div>
      <div></div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default{
    name: 'Room',
    data(){
      return {
        goods: [],
        num: 0,
        food_info: []
      }
    },
    created(){
      axios.get('../../static/data.json').then((res) => {
        this.goods = res.data.goods;
        //this.rooms = res.data.lists[0].rooms
      })
    },
    methods: {
      toggle: function (index) {
        this.num = index
      },
      onChooseNorms: function (room) {
        this.food_info = room
        document.getElementById("food_norms").setAttribute("class", "dis_foodNormsDiv")
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
</style>
