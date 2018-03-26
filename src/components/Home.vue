<template>
  <div class="container">
    <div id="topbar_home">
      <span @click="goback()"><img src="../assets/back.png"></span>
      <!--<img src="../assets/goback.png"/>-->
      桌台状态
    </div>
    <div id="titlebar_home">
      <span><img src="../assets/shop_color.png"/></span>
      <p>{{shopname}}</p>
    </div>
    <div class="maindiv">
      <div class="navdiv">
        <ul>
          <li v-for="(item, index) in lists" v-bind:class="{active:index == num}" @click="toggle(index)">
            <span><img src="../assets/hall.png"></span>
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="tabcontent">
        <div v-for="(room, index) in rooms" @click="onRoomOpen(room)">
          <div :class="[ 'desk_'+room.status,'roomdiv']" v-if="room.status==1">
            <span :class="'desk_status_img_'+room.status">订</span>
            <p>
              {{room.title}}
            </p>
            <div class="desk_bottom_text">
              <p>可供{{room.seatNum}}人</p>
            </div>
          </div>
          <div :class="[ 'desk_'+room.status,'roomdiv']" v-else-if="room.status==5||room.status==4">
            <span :class="'desk_status_img_'+room.status">结</span>
            <p>
              {{room.title}}
            </p>
            <p>可供{{room.seatNum}}人</p>
          </div>
          <div :class="[ 'desk_'+room.status,'roomdiv']" v-else-if="room.status==3">
            <p>
              {{room.title}}
            </p>
            <p>&yen;{{room.seatNum}}</p>
          </div>
          <div :class="[ 'desk_'+room.status,'roomdiv']" v-else>
            <span :class="'desk_status_img_'+room.status"></span>
            <p>
              {{room.title}}
            </p>
            <div v-if="room.status==2" :class="'bottom_div_'+room.status">
              <p>未下单</p>
            </div>
            <div v-else :class="'bottom_div_'+room.status">
              <p>可供{{room.seatNum}}人</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="roomopendiv" class="no_display_room">
      <div class="centerdiv">
        <div class="room_title_bar">
          <p>开台-{{openRoom.title}}（{{openRoom.tableNo}}）
            <span @click="onCloseRoom()"><img src="../assets/close_icon.png"></span></p>
        </div>
        <div class="room_main_form">
          <label>就餐人数</label>
          <input placeholder="请输入人数" id="mealsNumbel_Input"/>
          <label>服务员</label>
          <input placeholder="001服务员" readonly id="employeeId_select" value="001"/>
          <!--<select id="employeeId_select">-->
          <!--<option value="" disabled selected>请选择服务员</option>-->
          <!--<option value="001">001</option>-->
          <!--</select>-->
          <div class="room_btn_div">
            <button>开台</button>
            <button @click="onOpenDesk()">开台并点餐</button>
          </div>
        </div>
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
        num: 0,
        merchanData: [],
        shopname: null,
        rooms: [],
        openRoom: [],
        requestData: new Object()
      }
    },

    created(){
      let getData = {
        mer: '1',
        sho: '66'
      }
      //http://113.105.152.179:8088/food ../static/respons.json
      axios.get('./static/respons.json',
//        {
//          params: {
//            mer: '1',
//            sho: '66'
//          }
//        }
      ).then((res) => {
//        console.log(res);
        this.merchanData = res.data;
        this.shopname = res.data.shopname;
        this.lists = res.data.table;
        this.rooms = res.data.table[0].shopTableList;
      })
//      this.rooms=lists[0].rooms
    },
    beforeDestroy (){
      eventBus.$emit("AttrDeliver", {tableName: this.openRoom.title});

    },
    destroyed(){
      eventBus.$off('AttrDeliver');
    },
    methods: {
      toggle: function (index) {
        this.num = index;
        this.rooms = this.lists[index].shopTableList;
      },
      onRoomOpen: function (room_info) {
        this.openRoom = room_info
        document.getElementById("roomopendiv").setAttribute("class", "display_room");
      },
      onCloseRoom: function () {
        document.getElementById("roomopendiv").setAttribute("class", "no_display_room")
      },
      onOpenDesk: function (event) {
        console.log(event);
        this.$router.push(
          '/room', 'Room'
        );
        document.getElementById("roomopendiv").setAttribute("class", "no_display_room");
        var employeeId_select = document.getElementById("employeeId_select");
        var employeeId = employeeId_select.value;
        var mealsNumbel_Input = document.getElementById("mealsNumbel_Input");
        var mealsNumbel = mealsNumbel_Input.value;
        this.requestData.employeeId = employeeId;
        this.requestData.mealsNumbel = mealsNumbel;
        window.localStorage.setItem("AllData", JSON.stringify(this.merchanData));
//        console.log(window.localStorage);
        //alert(employeeId+mealsNumbel);

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
  @import '../../static/css/home.css';

</style>
