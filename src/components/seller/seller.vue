<template>
  <div class="seller">
    <div class="seller-body">
      <div class="content-wrapper">
        <div class="content-name">
          <div class="content-title">{{seller.name}}</div>
          <div class="brand1"></div>
          <div class="brand2"></div>
          <div class="brand3"></div>
          <div class="brand4"></div>
          <div class="brand5"></div>
          <div class="content-sell"><span class="content-sell-span">(661)</span>
            <span> 月售690单</span></div>
        </div>
        <div class="config">
          <ul class="content-ul">
            <li class="content-li"><p class="cotent-font1">起送价</p><p class="cotent-font2">{{seller.score}}</p><p  class="cotent-font3">元</p></li>
            <li class="content-li-middle"><p class="cotent-font1">配送费</p><p  class="cotent-font2">{{seller.deliveryPrice}}</p><p  class="cotent-font3">元</p></li>
            <li class="content-li"><p class="cotent-font1">平均配送时间</p><p  class="cotent-font2">{{seller.serviceScore}}</p><p  class="cotent-font3">元</p></li>
          </ul>
        </div>
      </div>
      <div class="divide"></div>
      <div class="notice">
        <div class="notice-content">
          <div >
            <p >公告与活动</p>
            <p class="bulletin">{{seller.bulletin}}</p>
          </div>
        </div>
        <div class="notice-active" v-for="support in  seller.supports" v-bind:key="support.type">
          <div class="brand" :class="classMap[support.type]"></div>
          <div class="content">{{support.description}}</div>
        </div>
      </div>
      <div class="divide"></div>
      <div class="environment">
        <div class="title">商家实景</div>
        <div class="brand" >
          <div class="brand-img" v-for="brand in seller.pics" v-bind:key="brand.id"><span><img :src="brand" width="120px" height="90px"></span></div>
        </div>
      </div>
      <div class="divide"></div>
      <div class="information" >
        <div class="title">商品信息</div>
        <div class="count" v-for="info in seller.infos" v-bind:key="info.id">
          <p class="count-p">{{info}}</p>
        </div>
      </div>
      <div class="divide"></div>
      <div>
      <div class="favorite" v-if="showFavorite" @click="showFavorite = false">
        <div class="icon-favorite favorite-no"></div>
        <div class="favorite-name">未收藏</div>
      </div>
      <div class="favorite"  v-else  @click="showFavorite = true">
          <div class="icon-favorite favorite-yes"></div>
          <div class="favorite-name">已收藏</div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
const ERR_OK = 0
export default {
  name: 'seller',
  data () {
    return {
      seller: {},
      classMap: [],
      showFavorite: true
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$axios.get('/api/seller').then((data) => {
      if (data.data.errno === ERR_OK) {
        this.seller = data.data.data
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
@import "./../../common/stylus/mixin1.styl"
.seller
  .seller-body
    border-bottom 1px solid rgba(7,17,27,0.1)
    .divide
      height 18px
      background-color rgba(7,17,27,0.1)
    .content-wrapper
      width 80%
      margin auto
      height 152px
      .content-name
        border-bottom  1px rgba(7,17,27,0.1) solid
        height 76px
        .content-title
          margin-top 18px
          margin-bottom  18px
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
        .content-sell
          display inline-block
          font-size 10px
          color rgb(77,85,93)
          line-height 18px
          .content-sell-span
            margin-right 12px
        .brand1
          bg-image('star36_on')
          display inline-block
          width 18px
          height 18px
          background-size 18px 18px
          vertical-align middle
        .brand2
          bg-image('star36_on')
          display inline-block
          width 18px
          height 18px
          background-size 18px 18px
          vertical-align middle
        .brand3
          bg-image('star36_on')
          display inline-block
          width 18px
          height 18px
          background-size 18px 18px
          vertical-align middle
        .brand4
          bg-image('star36_on')
          display inline-block
          width 18px
          height 18px
          background-size 18px 18px
          vertical-align middle
        .brand5
          bg-image('star36_off')
          display inline-block
          width 18px
          height 18px
          background-size 18px 18px
          vertical-align middle
      .config
        padding-top 18px
        padding-bottom  18px
        height 76px
        .content-ul
          display flex
          .content-li
            flex 1
            text-align center
            .cotent-font1
              font-size 10px
              color rgb(147,153,159)
              line-height 10px
            .cotent-font2
              font-size 24px
              color rgb(7,17,27)
              font-weight 200
              line-height 24px
              display inline-block
              margin-top 4px
            .cotent-font3
              font-size 10px
              color rgb(7,17,27)
              font-weight 200
              line-height 24px
              display inline-block
          .content-li-middle
            flex 1
            text-align center
            border-left 1px solid rgba(7,17,27,0.1)
            border-right  1px solid rgba(7,17,27,0.1)
            .cotent-font1
              font-size 10px
              color rgb(147,153,159)
              line-height 10px
            .cotent-font2
              font-size 24px
              color rgb(7,17,27)
              font-weight 200
              line-height 24px
              display inline-block
              margin-top 4px
            .cotent-font3
              font-size 10px
              color rgb(7,17,27)
              font-weight 200
              line-height 24px
              display inline-block
    .notice
      padding 18px 18px 0 18px
      .notice-content
        .bulletin
          font-size 12px
          font-weight 200
          color rgb(240,20,20)
          line-height 24px
          margin  8px 12px 16px 12px
      .notice-active
        height 49px
        border-bottom 1px rgba(7,17,27,0.1) solid
        padding 16px 0 16px 12px
        .brand
          display inline-block
          width 16px
          height 16px
          background-size 16px 16px
          vertical-align middle
          &.decrease
            bg-image('decrease_1')
          &.discount
            bg-image('discount_1')
          &.special
            bg-image('special_1')
          &.invoice
            bg-image('invoice_1')
          &.guarantee
            bg-image('guarantee_1')
        .content
          display inline-block
          font-size 12px
          font-weight 200
          color rgb(7,17,27)
          line-weight 16px
    .environment
      padding 18px 0 18px 18px
      .title
        margin-bottom 12px
      .brand
        display inline-block
        box-sizing content-box
        height 99px
        width 100%
        overflow auto
        .brand-img
          display inline
          white-space nowrap
          text-align center
          width 120px
          height  90px
          margin-right 6px
    .information
      padding 18px 18px 6px 18px
      .title
        margin-bottom 12px
      .count
        border-top 1px solid rgba(7,17,27,0.1)
        padding 16px 12px 16px 12px
        .count-p
          font-size 12px
          font-weight 200
          color rgb(7,17,27)
          line-height 16px
    .favorite
      text-align center
      position absolute
      right 20px
      top 200px
      .favorite-no
        font-size 24px
        color rgb(7,17,27)
        line-height 24px
      .favorite-name
        font-size 10px
        color rgb(77,85,93)
        margin-top 4px
      .favorite-yes
        font-size 24px
        color rgb(240,20,20)
        line-height 24px
</style>
