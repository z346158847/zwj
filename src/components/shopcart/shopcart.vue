<template>
  <div class="shopcart">
    <div class="pop-wrapper"  v-show="pop1" >
      <div class="foods-wrapper"  >
        <div  class="foods-content" >
          <div class="title">
            <span class="cart">购物车</span>
            <span class="clear" @click="clearfoods()">清空</span>
          </div>
          <div  class="cartList"  ref="cartList">
            <ul>
              <li v-for="food in selectFoods" v-bind:key="food.id" class="wrapper-li">
                <div class="name">{{food.name}}</div>
                <div class="price">
                  <span class="price-small">￥</span>
                  <span class="price-big">{{food.price}}</span>
                </div>
                <div class="cartcontrol" @click="aaa()"><cartcontrol :food="food"></cartcontrol></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-wrapper">
      <div class="shopcart-brand" @click="popShow()">
        <div class="brand icon-shopping_cart" :class="selectFoods.length>0?'_shopcart':''">
          <div class="sumcount" v-show="sumCount > 0">{{sumCount}}</div>
        </div>
      </div>
      <div  class="shopcart-money" @click="popShow()">
        <div class="shopcart-money-middle " :class="sumPrice > 0?'_money':''">￥{{sumPrice}}</div>
      </div>
      <div  class="shopcart-delivery" @click="popShow()">
        <div>另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="shopcart-price " :class="payClass?'_price':''" >
        <div>{{payCount}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import cartcontrol from './../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
export default {
  name: 'shopcart',
  components: {
    cartcontrol
  },
  data () {
    return {
      pop1: false,
      pay: false
    }
  },
  props: {
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.cartList, {click: true})
    })
  },
  updated () {
    this.scroll.refresh()
  },
  methods: {
    aaa () {
      if (this.sumCount < 1) {
        this.pop1 = false
      }
    },
    popShow () {
      if (this.sumCount === 0) {
        this.pop1 = false
      } else {
        this.pop1 = !this.pop1
      }
    },
    clearfoods () {
      this.$emit('clearfoods')
      this.pop1 = false
    }
  },
  computed: {
    sumPrice () {
      let price = 0
      this.selectFoods.forEach((food) => {
        price += food.price * food.count
      })
      return price
    },
    sumCount () {
      let sumcount = 0
      this.selectFoods.forEach((food) => {
        sumcount += food.count
      })
      return sumcount
    },
    payCount () {
      if (this.selectFoods.length === 0) {
        return `￥${this.minPrice}起送`
      } else if (this.sumPrice < this.minPrice) {
        return '还差￥' + (this.minPrice - this.sumPrice) + '起送'
      } else {
        return '去支付'
      }
    },
    payClass () {
      if (this.sumPrice >= this.minPrice) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.shopcart
  .cart-wrapper
    position fixed
    bottom 0
    left 0
    height 46px
    width 100%;
    display flex
    background-color #141d27
    color rgba(255,255,255,0.4)
    .shopcart-brand
      flex  0 0 64px
      box-sizing content-box
      display inline-block
      .brand
        border-radius 100%
        box-sizing content-box
        position relative
        top -10px
        left 2px
        border 6px solid #141d27
        padding 10px
        width 22px
        height 22px
        margin 0 auto
        text-align center
        background-color #2b343c
        z-index 2
        color rgba(255,255,255,0.4)
        font-size 20px
        vertical-align middle
      .sumcount
        position absolute
        top -5px
        right -5px
        text-align center
        border-radius 7px
        font-size 12px
        line-height 16px
        font-weight 300
        width 24px
        background #f01414
        z-index 999
      ._shopcart
        color #FFF
        background-color rgb(0,160,220)
    .shopcart-money
      flex 2.5
      font-size 14px
      font-weight bold
      padding 16px 10px  12px 0
      .shopcart-money-middle
        border-right 1px solid rgba(255,255,255,0.1)
      ._money
        color #FFF
    .shopcart-delivery
      flex 6
      line-height 46px
      font-size 12px
      font-weight 200
    .shopcart-price
      flex 0 0 105px
      background-color #2b343c
      display inline-block
      line-height 46px
      text-align center
      font-weight 700
      font-size 14px
    ._price
      background-color rgb(0,160,220)
  .pop-wrapper
    position fixed
    bottom 46px
    right 0
    width 100%
    height 100%
    background-color rgba(7,17,27,0.6)
    &::before
      content: ""
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
      overflow: hidden
      filter blur(100px)
      background-color: rgba(7,17,27,0.8)
    .foods-wrapper
      max-height 282px
      width 100%
      position absolute
      bottom 0
      right 0
      background-color #FFF
      z-index 101
      .foods-content
        .title
          display flex
          height 40px
          background-color #f3f5f7
          padding 0 18px
          font-size 14px
          font-weight 200
          color rgb(7,17,27)
          line-height 40px
          .cart
            flex 1
            font-size 14px
            color rgb(7,17,27)
            line-height 24px
          .clear
            display inline-block
            flex 1
            text-align right
            font-size 12px
            color rgb(0,160,220)
            line-height 40px
        .cartList
          max-height 242px
          overflow hidden
          width 100%
          .wrapper-li
            padding 0 18px
            display flex
            line-height 30px
            .name
              display inline-block
              flex 2
              font-size 14px
              line-height 24px
              color rgb(7,17,27)
            .price
              display inline-block
              flex 1
              text-align right
              padding-right  12px
              .price-small
                font-size 10px
                font-weight 400
                line-height 24px
                color rgb(240,20,20)
              .price-big
                font-size 14px
                font-weight 700
                line-height 24px
                color rgb(240,20,20)
            .cartcontrol
              display inline-block
              flex 0 0 82px
</style>
