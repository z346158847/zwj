<template>
    <div class="sHead">
      <div class="content-wrapper">
        <div class="avatar">
          <img :src="seller.avatar">
        </div>
        <div class="content">
          <div class="title">
            <div class="brand "></div>
            <div class="name">{{seller.name}}</div>
          </div>
          <div class="description">
            <div>{{seller.description}}/{{seller.deliveryTime}}分送达</div>
          </div>
          <div class="supports" v-if="seller.supports">
            <span class="brand" :class="classMap[seller.supports[0].type]"></span>
            <div class="supports-name">{{seller.supports[0].description}}</div>
          </div>
        </div>
        <div class="supports-count " v-if="seller.supports" @click="showNotice = true" >
          <div class="supports-count-1"> {{seller.supports.length}}个</div><div class="supports-count-2 icon-keyboard_arrow_right"></div>
        </div>
      </div>
      <div class="backgroud">
        <img :src="seller.avatar" width="100%" height="100%"/>
      </div>
      <div class="sfoot" @click="showNotice = true">
        <div class="brand"></div>
        <div class="sfoot-name"><div class="sfoot-name-p">{{seller.bulletin}}</div>
          <div class="supports-count-2 icon-keyboard_arrow_right"></div>
        </div>
      </div>
      <div class="detail" v-show="showNotice"  @touchmove.prevent @click="showNotice = false">
        <div class="detail-wrapper">
            <div class="detail-name">{{seller.name}}</div>
            <div class="brand">
              <div class="brand1"></div>
              <div class="brand2"></div>
              <div class="brand3"></div>
              <div class="brand4"></div>
              <div class="brand5"></div>
            </div>
          <div class="detail-title">
            <div class="detail-line"></div>
            <div class="detail-name">优惠信息</div>
            <div class="detail-line"></div>
          </div>
          <div class="detail-active" v-for="support in  seller.supports" v-bind:key="support.type">
            <div class="detail-brand" :class="classMap[support.type]"></div>
            <div class="content">{{support.description}}</div>
          </div>
          <div class="detail-title">
            <div class="detail-line"></div>
            <div class="detail-name">商家公告</div>
            <div class="detail-line"></div>
          </div>
          <div class="detail-content">{{seller.bulletin}}</div>
          <div class="detail-quit icon-close" @click="showNotice = false" ></div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'sHead',
  data () {
    return {
      classMap: [],
      showNotice: false
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
@import "./../../common/stylus/mixin1.styl"

.sHead
  width 100%
  height 134px
  overflow hidden
  background-color rgba(7,17,27,0.5)
  display block
  .content-wrapper
    width 100%
    height 106px
    display flex
    padding 24px 0 0 24px
    .avatar
      display inline-block
      width 64px
      height 64px
      &>img
        width 64px
        height 64px
    .content
      vertical-align top
      display inline-block
      height 60px
      margin-left 16px
      margin-top 2px
      .title
        .brand
          display inline-block
          width 30px
          height 18px
          bg-image ('brand')
          background-size 30px 18px
        .name
          vertical-align top
          display inline-block
          margin-top 1px
          font-size 16px
          font-weight bold
          color rgb(255,255,255)
      .description
        font-size 12px
        font-weight 200
        color rgb(255,255,255)
        line-height 12px
        margin-top 8px
        margin-bottom 10px
      .supports
        vertical-align center
        .brand
          display inline-block
          width 12px
          height 12px
          background-size 12px 12px
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
        .supports-name
          display inline-block
          font-size 10px
          color rgb(255,255,255)
    .supports-count
      display inline-block
      position absolute
      height 24px
      width 50px
      border-radius 12px
      background-color rgba(0,0,0,0.2)
      line-height 24px
      right 24px
      top 70px
      font-size 10px
      color rgb(255,255,255)
      font-weight 200
      .supports-count-1
        margin-top 2px
        margin-left 12px
        display inline-block
      .supports-count-2
        display inline-block
        margin-top 2px
  .sfoot
    width 100%
    height 28px
    background-color rgba(0,0,0,0.2)
    display flex
    padding-left 5px
    .brand
      display inline-block
      bg-image('bulletin')
      width 24px
      height 14px
      background-size 24px 14px
      vertical-align middle
      margin-top 6px
    .sfoot-name
      display flex
      width 85%
      font-size 10px
      color rgb(255,255,255)
      font-weight 200
      line-height 28px
      vertical-align middle
      margin-left 5px
      height 28px
      .sfoot-name-p
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
        margin 0
      .supports-count-2
        display inline-block
        line-height 28px
        vertical-align middle
  .backgroud
    position absolute
    left 0
    top 0
    z-index -1
    width 100%
    height 134px
    filter blur(10px)
  .detail
    width 100%
    min-height 150%
    position absolute
    top 0
    padding 64px 0 64px 0
    z-index 99
    &::before
      content: ""
      position absolute
      width 100%
      height 100%
      top 0
      left 0
      overflow:hidden
      filter blur(10px)
      background-color rgba(7,17,27,0.8)
    .detail-wrapper
      position fixed
      z-index 100
      padding-left 36px
      padding-right  36px
      .detail-name
        font-size 16px
        font-weight 700
        color rgb(255,255,255)
        line-height 16px
        text-align center
      .brand
        margin-top 16px
        margin-bottom  28px
        text-align center
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
    .detail-title
      display flex
      margin-top 20px
      margin-bottom 24px
      .detail-name
        flex 1
        font-size 14px
        font-weight 700
        color rgb(255,255,255)
        line-height 14px
        text-align center
      .detail-line
        flex 1
        border-bottom 1px solid rgba(255,255,255,0.5)
        height 5px
    .detail-active
      height 28px
      .detail-brand
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
        color rgb(255,255,255)
        line-weight 16px
    .detail-content
      padding-left 12px
      padding-right  12px
      font-size 12px
      font-weight 200
      color rgb(255,255,255)
      line-height 24px
    .detail-quit
      text-align center
      font-size 32px
      color rgba(255,255,255,0.5)
      width 45px
      height 45px
      margin auto
      margin-top 80px
</style>
