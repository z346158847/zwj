<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="wrapper-ul">
        <li class="wrapper-li" v-for="(good,index) in goods" v-bind:key="good.id" @click="selectMenu(index)"  :class="{'current': currentIndex === index}">
          <div class="wrapper-table">
            <span class="wrapper-brand" v-show="good.type > 0"  :class="classMap[good.type]"></span>
            <span class="wrapper-name">{{good.name}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="good in goods" v-bind:key="good.id" class="Wrapper">
          <h1 class="title" >{{good.name}}</h1>
          <ul class="title-ul">
            <li v-for="food in good.foods" v-bind:key="food.id" class="title-li border-1px">
              <div class="avatar">
                <img :src="food.icon" width="52px" height="52px">
              </div>
              <div class="content">
                <div class="content-name">{{food.name}}</div>
                <div class="content-description">{{food.description}}</div>
                <div class="content-sell"><span class="content-sellcount">月售{{food.sellCount}}份</span><span class="content-rating">好评率{{food.rating}}%</span></div>
                <div  class="content-pri"><span  class="content-price" style="font-size: 10px">￥</span><span class="content-price">{{food.price}}</span><span v-if="food.oldPrice" class="content-oldprice">￥{{food.oldPrice}}</span></div>
              </div>
              <!--<div class="count">
                <div  class="brand1 icon-remove_circle_outline " @click="count&#45;&#45;" v-show="count > 0"></div>
                <div  class="count-sum"  v-show="count > 0">{{count}}</div>
                <div  class="brand2 icon-add_circle"  @click="count++"></div>
              </div>-->
              <div class="cartcontrol-wrapper" >
                <cartcontrol  :food="food" ></cartcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods" @clearfoods="clearfoods()"></shopcart>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from './../shopcart/shopcart'
import cartcontrol from './../cartcontrol/cartcontrol'
export default {
  name: 'goods',
  components: {
    shopcart,
    cartcontrol
  },
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      classMap: [],
      scrollY: 0,
      listHeight: []
    }
  },
  created () {
    this.$axios.get('/api/goods').then((data) => {
      this.goods = data.data.data
      this.$nextTick(() => {
        this._initScroll()
        this.caluateHeight()
      })
    })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (this.scrollY >= height1 && this.scrollY < height2) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true})
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {click: true, probeType: 3})
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    caluateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('Wrapper')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height = item.clientHeight + height
        this.listHeight.push(height)
      }
    },
    selectMenu (index) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('Wrapper')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
      this.currentIndex = index
    },
    clearfoods () {
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            food.count = 0
          }
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "./../../common/stylus/mixin1.styl"
.goods
  position absolute
  display flex
  top 174px
  left 0
  bottom 46px
  width 100%
  .menu-wrapper
    flex 0 0 80px
    background-color #f3f5f7
    font-size 12px
    font-weight 200
    line-height 14px
    overflow hidden
    .wrapper-ul
      .wrapper-li
        display table
        width 100%
        height 54px
        text-align center
        padding 0 12px
        &.current
          background-color white
          .wrapper-table
            border-bottom none
        &:last-child
          border-bottom none
        .wrapper-table
          display table-cell
          vertical-align middle
          border-bottom 1px solid rgba(7,17,27,0.1)
          .wrapper-brand
            width 12px
            height  12px
            background-size 14px 14px
            display inline-block
            vertical-align top
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
          .wrapper-name
            font-size 12px
            color rgb(77,85,93)
            font-weight 200
            line-height 14px
  .foods-wrapper
    flex 1
    overflow hidden
    .title
      background-color #f3f5f7
      border-left 2px rgb(147,153,159) solid
      font-size 12px
      color rgb(147,153,159)
      line-height 26px
    .title-ul
      .title-li
        display flex
        position relative
        padding 18px 0
        width 85%
        margin auto
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex 0 0 52px
          vertical-align top
        .content
          flex 1
          display inline-block
          margin-left 8px
          .content-name
            font-size 14px
            color rgb(7,17,27)
            line-height 14px
            margin-bottom 8px
          .content-description
            font-size 10px
            color rgb(147,153,159)
            line-height 12px
            margin-bottom 2px
          .content-sell
            margin-bottom 2px
            .content-sellcount
              font-size 10px
              color rgb(147,153,159)
              line-height 10px
              margin-right 12px
            .content-rating
              font-size 10px
              color rgb(147,153,159)
              line-height 10px
          .content-pri
            .content-price
              font-size 14px
              color rgb(240,20,20)
              line-height 14px
            .content-oldprice
              font-size 10px
              color rgb(147,153,159)
              line-height 10px
              text-decoration line-through
        .cartcontrol-wrapper
          position absolute
          height 30px
          right 0
          bottom 0
      /*.count
        display flex
        position absolute
        right 0
        bottom 10px
        width 64px
        height 24px
        .brand1
          flex 1
          width 20px
          height 20px
          float left
        .count-sum
          flex 1
          float left
          width 24px
          text-align center
        .brand2
          flex 1
          width 20px
          height 20px
          float right
          display inline-block
          text-align right
          vertical-align middle*/
</style>
