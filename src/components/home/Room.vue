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
        <div class="taste_item_div" v-if="food_info.hasSize">
        </div>
        <div class="taste_item_div" id="size_item_div">
          <p class="norms_la">规格</p>
          <label class="ladu_label">
            <input type="radio" name="size" checked :value="food_info.title"
                   @change="onSelectedSize(food_info)"/>{{food_info.title}}
          </label>
          <label class="ladu_label" v-for="size_item in food_info.foodsize">
            <input type="radio" name="size" :value="size_item.title" lazy
                   @change="onSelectedSize(size_item)"/>{{size_item.title}}</label>
        </div>
        <div class="food_center_laduInfo" v-show="food_info.hasTaste">
          <p class="norms_la">口味</p>
          <label class="ladu_label" v-for="taste_item in food_info.foodtasetEntity">
            <input type="radio" name="tasteEntity" :value="taste_item.name"
                   @change="onSelectedTaste(taste_item)"/>{{taste_item.name}}</label>
        </div>
        <div class="food_center_price">
          <span class="trueprice_span">&yen;{{food_info.weixin}}</span>
          <span class="oriprice_span">&yen;{{food_info.retailPrice}}</span>
          <!--<span class="ladu_span">{{food_info.remark}}</span>-->
          <span class="food_center_shopcart_span" @click="onAddFood(food_info)">
            <img src="../../assets/shopcart_s.png"/>加入购物车</span>
        </div>
      </div>
    </div>
    <div class="shop_carts autoheight" id="shop_carts">
      <div id="shopItem" class="no_display_shop">
        <div class="shop_blank_div" @click="onDisplayShop(isShop)"></div>
        <div class="shopItemDetail">
          <p><span class="shop_name_span">购物车</span><span class="clear_span" @click="onClearShop()"><img
            src="../../assets/clear.png"/>清空</span></p>
          <ul>
            <li v-for="item in menuItem">
              <div class="menuItem_div" v-show="item.num">
                <span class="shopcart_name_span">{{item.name}}</span>
                <span class="shopcart_money_span_none" v-if="!item.hasTaste">&yen;{{item.weixin}}<br><span
                  style="font-size: .75em;">{{item.tasteRemark}}</span></span>
                <span class="shopcart_money_span" v-else="">&yen;{{item.weixin}}<br><span
                  style="font-size: .75em;">{{item.tasteRemark}}</span></span>
                <span class="shopcart_remark_span">{{item.sizeRemark}}</span>
                <span class="shopcart_count_span">
                <span @click="onReduceFoodItem(item)"><img src="../../assets/minus.png"/></span>
                {{item.num}}
                <span @click="onAddFoodItem(item)"><img src="../../assets/plus.png"/></span>
              </span>
              </div>
              <!--<span style="text-align: center;width: 100%;float: left">{{item.tasteRemark}}</span>-->
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
        isCreate: 0
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
      window.addEventListener("beforeunload", function () {
//    if (window.localStorage.isGuest) {
        window.localtion.href = "/web?mer=" + window.localStorage.getItem("merchantId") + "&sho="
          + window.localStorage.getItem("shopId") + "&tab=" + window.localStorage.getItem("tableId");
//    }
      })
//      _this.isCreate = !_this.isCreate;
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
                window.localStorage.removeItem("shopName");
                window.localStorage.setItem("shopName", res.data.shopname);
                document.title = res.data.shopname;
                _this.goods = res.data.foodlist;
                if (res.data.seat == null) {
                  _this.tableName = res.data.tablename;
                } else {
                  _this.tableName = res.data.tablename + res.data.seat;
                }

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
//                alert(_this.goods);
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
        _this.tableName = window.localStorage.getItem("tableName");
        _this.menus = _this.goods[0].foods;
      }
    },

//    beforeMount(){
//      alert("aaaa");
////      alert("BeforeMounted");
////      window.location.href="www.baidu.com";
////      window.addEventListener("beforeunload", function (e) {
////        var aaa = '确定要离开吗？';
////        e.returnValue = aaa;
////        return aaa;
////      });
//      //  挂载前状态
//    },

//    mounted()
//    {
//      //  挂载结束状态
////      window.location.href="?";
////      if(this.isCreate) {
////        window.location.href = window.localtion.href = "?mer=" + window.localStorage.getItem("merchantId") + "&sho="
////          + window.localStorage.getItem("shopId") + "&tab=" + window.localStorage.getItem("tableId");
////      }else {
////          return;
////      }
//      alert("bbbb");
////      window.addEventListener("beforeunload",function (e) {
////        var aaa = '确定要离开吗？';
////        e.returnValue = aaa;
////        return aaa;
////      });
//    }
//    ,
    beforeDestroy()
    {
      var _this = this;
      var shopInfo = new Object();
      shopInfo.shopName = _this.shopName;
      shopInfo.tableName = _this.tableName;
      //      alert(_this.shopName);
      eventBus.$emit("PayAttrDeliver", {
        tableName: _this.tableName,
//        shopName: _this.shopName,
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
      window.localStorage.setItem("tableName", _this.tableName);
    }
    ,
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
//        alert("切换菜单" + index + ",");
        console.log(this.menus);
      }
      ,
      onChooseNorms: function (food, event) {
        var data = new Object();
        data.id = food.id;
        data.name = food.name;
        data.num = food.num;
        data.weixin = food.weixin;
        data.preweixin = food.weixin;
        data.foodsize = food.foodsize;
        data.foodtasetEntity = food.foodtasetEntity;
        data.avator = food.avator;
        data.retailPrice = food.retailPrice;
        data.categoryname = food.categoryname;
        data.title = food.title;
        var hasSize, hasTaste;
        if (food.foodsize.length == 0 || food.foodsize == null) {
          hasSize = false;
        } else {
          hasSize = true;
        }
        if (food.foodtasetEntity.length == 0 || food.foodtasetEntity == null) {
          hasTaste = false;
        } else {
          hasTaste = true;
        }
        data.hasSize = hasSize;
        data.hasTaste = hasTaste;

        document
          .getElementById("food_norms")
          .setAttribute("class", "dis_foodNormsDiv");
        this.food_info = data;
      }
      ,
      onCloseRoom: function () {
        document
          .getElementById("food_norms")
          .setAttribute("class", "nodis_foodNormsDiv");
      }
      ,
      //规格窗口里的加入购物车的方法
      onAddFood: function (fooditem) {
        var _this = this;
        var arr = new Object();
        arr.remark = "";
        arr.id = fooditem.id;
        arr.weixin = _this.food_info.weixin;
        arr.preweixin = _this.food_info.weixin;
        arr.foodsize = fooditem.foodsize;
        arr.foodtasetEntity = fooditem.foodtasetEntity;
        arr.num = 0;
        arr.name = fooditem.name;
        arr.avator = fooditem.avator;
        arr.categoryname = fooditem.categoryname;
        arr.title = fooditem.title;
        arr.hasTaste = fooditem.hasTaste;
        var cateNum = _this.goods.findIndex(x => x.foodCategory == arr.categoryname);

        if (
          arr.foodsize.length != 0 ||
          arr.foodtasetEntity.length != 0
        ) {
          var sizeCheckbox = document.getElementsByName("size");
          var tasteCheckbox = document.getElementsByName("tasteEntity");
          var checkedSize = 0;
          if (sizeCheckbox.length != 0) {
            for (var i = 0; i < sizeCheckbox.length; i++) {
              if (sizeCheckbox[i].checked) {
                checkedSize++;
                arr.remark = sizeCheckbox[i].value;
                arr.sizeRemark = "/" + sizeCheckbox[i].value;
//                sizeCheckbox[i].checked = false;
              } else {
                continue;
              }
            }
            if (!checkedSize) {
              alert("请选择规格");
              return;
            }
          }
          var checkedtaste = 0;
          if (tasteCheckbox.length != 0) {
            for (var j = 0; j < tasteCheckbox.length; j++) {
              if (tasteCheckbox[j].checked) {
                checkedtaste++;
                arr.remark += "," + tasteCheckbox[j].value;
                arr.tasteRemark = tasteCheckbox[j].value;
                tasteCheckbox[j].checked = false;
              } else {
                continue;
              }
            }
            if (!checkedtaste) {
              alert("请选择口味");
              return;
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
        if (cateNum == -1) {
          alert("返回菜单项的大类菜单名为空");
        } else {
          _this.goods[cateNum].seletedNum++;
        }
        console.log(9, _this.menuItem);
        //        console.log(this.menuItem);

//        alert("点击菜单加号");
        document
          .getElementById("food_norms")
          .setAttribute("class", "nodis_foodNormsDiv");
      }
      ,
      //点击选规格按钮后的加号按钮方法
      onAddFoodItem: function (fooditem) {
        var _this = this;
        _this.foodNums++;
        var arr = new Object();
        arr.remark = fooditem.title;
        arr.id = fooditem.id;
        arr.weixin = fooditem.weixin;
        arr.preweixin = fooditem.weixin;
        arr.foodsize = fooditem.foodsize;
        arr.foodtasetEntity = fooditem.foodtasetEntity;
        arr.num = fooditem.num;
        arr.name = fooditem.name;
        arr.avator = fooditem.avator;
        arr.categoryname = fooditem.categoryname;
        arr.title = fooditem.title;
        arr.sizeRemark = "/" + fooditem.title;
        arr.hasTaste = false;

        //找一样菜单大类名字，然后数字加一
//        alert(arr.num + "从goods里面findindex" + fooditem.categoryname+","+_this.goods.length);passed
        for (var i = 0; i < _this.goods.length; i++) {
//          alert(i + "for goods" + fooditem.categoryname);
          if (fooditem.categoryname === _this.goods[i].foodCategory) {
            _this.goods[i].seletedNum++;
          } else {
            continue;
          }
        }
//        var cateNum = _this.goods.findIndex(x => x.foodCategory == fooditem.categoryname);
//        alert(arr.num + "从goods里面findindex" + fooditem.categoryname + "成功");
//        if (cateNum == -1) {
//          alert("菜单项对应的大类菜单名称为空");
//        } else {
//
//        }
//        console.log(this.goods.seletedNum);
        var price = parseFloat(arr.weixin);
        _this.totalPrice = parseFloat(_this.totalPrice);
        _this.totalPrice += price;
        _this.totalPrice = _this.totalPrice.toFixed(2);
        //找id一样的菜单
        var inMenuItem = _this.menuItem;
//        alert(_this.menuItem.length);
        if (inMenuItem.length == 0) {//passed
//            alert("menuItem.length为0");
          arr.num++;
//          fooditem.num = arr.num;
          inMenuItem.push(arr);
//          alert(_this.menuItem.length);
        } else {
//          var isSameid = _this.menuItem.findIndex(x => x.id == arr.id);

//          alert("准备遍历mnuItem的length" + inMenuItem.length);
          for (var m = 0; m <= inMenuItem.length; m++) {
//              alert(m);
              if (inMenuItem[m].id === arr.id) {
//                alert(m + "," + inMenuItem[m].id + "," + arr.id);
                inMenuItem[m].num++;
//                fooditem.num = _this.menuItem[m].num;
                break;
              } else {
//                  alert(m+","+inMenuItem.length);
                if (m == inMenuItem.length-1) {
                  arr.num++;
//                  fooditem.num = arr.num;
                  inMenuItem.push(arr);
//                  alert(m+","+inMenuItem.length);
                  break;
                } else {
//                alert("两个id不相等");
                  continue;
              }
            }
          }
        }
        var isSameid = _this.menuItem.findIndex(x => x.id == arr.id);
        var isMenuSameid = _this.menus.findIndex(x => x.id == arr.id);

        var isSameTaste;
        //        if (fooditem.nums == undefined) {
        //          fooditem.nums = 1;
        //        } else {
        //          fooditem.nums++;
        //        };
//        if (isSameid == -1) {
//
////          fooditem.num++;
//        } else {
//          _this.menuItem[isSameid].num++;
//        }
        if (isMenuSameid == -1) {
          for (var n = 0; n < _this.goods.length; n++) {
            var menuItemId = _this.goods[n].foods.findIndex(x => x.id == arr.id);
            if (menuItemId != -1) {
              _this.goods[n].foods[menuItemId].num++;
            } else {
              continue;
            }
          }

          return;
        } else {
          _this.menus[isMenuSameid].num++;
        }
//        fooditem.num++;
        console.log(_this.menuItem, isSameid);
      }
      ,
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
        if (isSameID != -1) {
          _this.menus[isSameID].num = fooditem_reduce.num;
        }
        // console.log(shopItemId, fooditem_reduce.num, 2);
        //        _this.menuItem[shopItemId].num--;
        if (_this.menuItem[shopItemId].num == 0) {
          _this.menuItem.splice(shopItemId, 1);
          // console.log(fooditem_reduce.num, 3);
        }
        for (var j = 0; j < _this.goods.length; j++) {
          var menuItemId = _this.goods[j].foods.findIndex(x => x.id == fooditem_reduce.id);
          if (menuItemId != -1) {
            if (_this.goods[j].foods[menuItemId].num != 0) {
              _this.goods[j].foods[menuItemId].num--;
            } else {
              continue;
            }
          } else {
            continue;
          }
        }
        // console.log(fooditem_reduce.num, 4);
        var price = parseFloat(fooditem_reduce.weixin);
        _this.totalPrice = parseFloat(_this.totalPrice);
        _this.totalPrice -= price;
        _this.totalPrice = _this.totalPrice.toFixed(2);
        _this.foodNums--;
//        alert("点击菜单减号" + _this.totalPrice);
        // console.log(fooditem_reduce.num, 5);
        //        _this.menus[isSameID].num--;
      }
      ,

      //选择规格对应价钱
      onSelectedSize: function (size_item) {
        var foodInfo = this.food_info;
        var price;
        if (size_item.title == foodInfo.title) {
          price = size_item.preweixin;
        } else {
          price = size_item.weixin;
        }
        price = parseFloat(price);
//        this.food_info.weixin = price;

        var tasteCheckbox = document.getElementsByName("tasteEntity");
        if (tasteCheckbox != null) {
          for (var j = 0; j < tasteCheckbox.length; j++) {
            if (tasteCheckbox[j].checked) {
              var num = foodInfo.foodtasetEntity.findIndex(x => x.name == tasteCheckbox[j].value);
              if (num == -1) {
                continue;
              } else {
                price += parseFloat(foodInfo.foodtasetEntity[num].price);
                price = price.toFixed(2);
              }
            } else {
              continue;
            }
          }
        }
        this.food_info.weixin = price;
      }
      ,
      onSelectedTaste: function (taste_item) {
        var foodinfo = this.food_info;
        var price;
        var taste_price = parseFloat(taste_item.price);
        var sizeCheckbox = document.getElementsByName("size");
        if (sizeCheckbox != null)
          for (var i = 0; i < sizeCheckbox.length; i++) {
            if (sizeCheckbox[i].checked) {
              if (sizeCheckbox[i].value == foodinfo.title) {
                price = parseFloat(foodinfo.weixin);
              } else {
                var num = foodinfo.foodsize.findIndex(x => x.title == sizeCheckbox[i].value);
                price = parseFloat(foodinfo.foodsize[num].weixin);
              }
              price += taste_price;
              price = price.toFixed(2);
            } else {
              continue;
            }
          }
        this.food_info.weixin = price;
      }
      ,
      onDisplayShop: function (isShop, e) {
        var shopcls = isShop ? "display_shop" : "no_display_shop";
        var height = isShop ? "fullheight" : "autoheight";
        document.getElementById("shopItem").setAttribute("class", shopcls);
        document.getElementById("shop_carts").setAttribute("class", height);
        this.isShop = !isShop;
      }
      ,
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
        for (var j = 0; j < this.goods.length; j++) {
          for (var m = 0; m < this.goods[j].foods.length; m++) {
            if (this.goods[j].foods[m].num != 0) {
              this.goods[j].foods[m].num = 0;
            } else {
              continue;
            }
          }
          this.goods[j].seletedNum = 0;
        }
        ;
        this.foodNums = 0;
        this.totalPrice = 0;
      }
      ,
      //关闭口味选择窗口
      onCloseTasteDiv: function () {
        this.isShowNorm = false;
      }
      ,
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
      }
      ,
      onRedirectToPay: function () {
//      if (this.menuItem.length == 0) {
//        alert("请先选择餐品再进行结算");
//      } else {
        this.$router.push("/pay", "Pay");
//      }
      }
    }
  }
</script>
<style scoped>
  /**{*/
  /*height: 100%;*/
  /*}*/
  @import "../../../static/css/room.css";
</style>
