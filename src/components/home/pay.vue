<template>
  <div class="pay_container">
    <div>
      下单
    </div>
    <div>{{shopName}}</div>
    <div>{{tableName}}</div>
  </div>
</template>

<script>
  export default{
    name: 'Pay',
    data(){
      return {
        shopName: null,
        tableName:null
      }
    },
    create(){
      var _this = this;
      eventBus.$on("PayAttrDeliver", function (val) {
        _this.tableName = val.tableName;
        _this.shopName = val.data.shopname;
      });
    }
  }
</script>
<style scoped>
  .pay_container {
    width: 100%;
    height: 100%;
    margin: 0em;
    padding: 0em;
  }
</style>
