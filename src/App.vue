<template>
  <div id="app">
    <s-head :seller = seller></s-head>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
      <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item" >
        <router-link to="/seller"  >商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"/>
  </div>
</template>

<script>
import sHead from './components/sHead/sHead'
import sNav from './components/sNav/sNav'

const ERR_OK = 0

export default {
  name: 'App',
  data () {
    return {
      seller: {}
    }
  },
  components: {
    sHead,
    sNav
  },
  created () {
    this.$axios.get('/api/seller').then((data) => {
      if (data.data.errno === ERR_OK) {
        this.seller = data.data.data
      }
    })
  }
}
</script>

<style lang="stylus">
@import "./common/stylus/mixin1.styl"
  #app
    .tab
      display flex
      width 100%
      height 40px
      line-height 40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex 1
        text-align center
        &>a
          display inline-block
          width 100%
          color rgb(77,85,93)
          font-size 14px
          &.router-link-active
            color rgb(240,20,20)
</style>
