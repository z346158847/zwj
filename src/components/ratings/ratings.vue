<template>
  <div class="ratings">
    <div class="ratings-wrapper">
      <div class="ratings-count">
        <div class="ratings-count-score">
          <div class="score1">3.9</div>
          <div class="score2">综合评分</div>
          <div class="score3">高于周边商家69.2%</div>
        </div>
        <div class="ratings-count-think">
          <div class="think">
            <div class="think-think">服务态度</div>
            <div class="think-brand">
              <div class="brand1"></div>
              <div class="brand2"></div>
              <div class="brand3"></div>
              <div class="brand4"></div>
              <div class="brand5"></div>
            </div>
            <div class="think-score">3.9</div>
          </div>
          <div class="think">
            <div class="think-think">味道评价</div>
            <div class="think-brand">
              <div class="brand1"></div>
              <div class="brand2"></div>
              <div class="brand3"></div>
              <div class="brand4"></div>
              <div class="brand5"></div>
            </div>
            <div class="think-score">4.0</div>
            </div>
          <div class="think">
            <div class="think-think">送达时间</div>
            <div class="think-time">44分钟</div>
          </div>
        </div>
      </div>
    </div>
    <div class="divide"></div>
    <div class="agree border-1px">
      <div class="agree-wrapper">
        <div class="agree-content">
          <button class="agree-button1"><div class="agree-content-all">全部</div><div class="agree-content-count">57</div></button>
          <button  class="agree-button2"><div class="agree-content-all">满意</div><div class="agree-content-count">47</div></button>
          <button  class="agree-button3"><div class="agree-content-all">不满意</div><div class="agree-content-count">10</div></button>
        </div>
        <div class="agree-or">
          <span class="brand1 icon-check_circle" @click="iconCheck=true " v-show="!iconCheck"></span>
          <span class="brand2 icon-check_circle" @click="iconCheck=false" v-show="iconCheck"></span>
          <span class="text1"  v-show="!iconCheck">只看有内容的评价</span>
          <span class="text2" v-show="iconCheck">只看有内容的评价</span>
        </div>
      </div>
    </div>
    <div class="user-ratings">
      <div class="user-ratings-wrapper">
        <div class="ratings-items border-1px" v-for="rating in ratings" v-bind:key="rating.id">
          <div class="brand" ><img :src="rating.avatar" alt="" width="30px" height="30px"></div>
          <div class="user-info" >
            <div class="user-info-span">
              <span class="user-info-name" v-if="rating.username">{{rating.username}}</span>
              <span  class="user-info-time" v-if="rating.rateTime">{{rating.rateTime}}</span>
            </div>
            <div  class="user-info-deliveryTime" v-if="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</div>
            <div class="user-info-rating" >{{rating.text}}</div>
            <div class="user-tag" >
              <span class="user-brand1 icon-thumb_up"  v-show="rating.rateType === 0"></span>
              <span class="user-brand2 icon-thumb_down"  v-show="rating.rateType === 1"></span>
              <span class="user-tag-rec" v-for="rec in rating.recommend" v-bind:key="rec.id">
                {{rec}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ERR_OK = 0
export default {
  name: 'ratings',
  data () {
    return {
      seller: {},
      ratings: {},
      iconCheck: false
    }
  },
  created () {
    this.$axios.get('/api/seller').then((data) => {
      if (data.data.errno === ERR_OK) {
        this.seller = data.data.data
      }
    })
    this.$axios.get('/api/ratings').then((data) => {
      if (data.data.errno === ERR_OK) {
        this.ratings = data.data.data
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
@import "./../../common/stylus/mixin1.styl"
.ratings
  .divide
    height 18px
    background-color rgba(7,17,27,0.1)
  .ratings-wrapper
    padding 18px 24px 18px 11px
    .ratings-count
      display flex
      .ratings-count-score
        flex 2
        text-align center
        margin-right 6px
        .score1
          font-size 24px
          color rgb(255,153,0)
          line-height 28px
          margin-bottom 6px
        .score2
          font-size 12px
          color rgb(7,17,27)
          line-height 12px
          margin-bottom 8px
        .score3
          font-size 10px
          color rgb(147,153,159)
          line-height 10px
      .ratings-count-think
        flex 4
        padding-top 4px
        font-size 12px
        color rgb(7,17,27)
        border-left 1px solid rgba(7,17,27,0.2)
        padding-left 24px
        .think
          margin-bottom 2px
          .think-think
            display inline-block
            margin-right 12px
          .think-brand
            display inline-block
            .brand1
              bg-image('star36_on')
              display inline-block
              width 12px
              height 12px
              background-size 12px 12px
            .brand2
              bg-image('star36_on')
              display inline-block
              width 12px
              height 12px
              background-size 12px 12px
            .brand3
              bg-image('star36_on')
              display inline-block
              width 12px
              height 12px
              background-size 12px 12px
            .brand4
              bg-image('star36_on')
              display inline-block
              width 12px
              height 12px
              background-size 12px 12px
            .brand5
              bg-image('star36_off')
              display inline-block
              width 12px
              height 12px
              background-size 12px 12px
          .think-score
            display inline-block
            margin-left 12px
            font-size 12px
            color rgb(255,153,0)
            line-height 18px
          .think-time
            display inline-block
            font-size 12px
            color rgb(147,153,159)
            line-height 18px
  .agree
    padding 10px
    border-1px(rgba(7,17,27,0.1))
    .agree-wrapper
      width 85%
      margin 0 auto
      .agree-content
        border-bottom 1px solid rgba(7,17,27,0.2)
        padding-bottom 28px
        .agree-button1
          background-color #89cff0
          border none
          padding 0 10px 0 10px
          .agree-content-all
            margin 12px 2px 12px 0
            font-size 12px
            color rgba(7,17,27,0.8)
            display inline-block
          .agree-content-count
            font-size 5px
            color rgba(7,17,27,0.8)
            display inline-block
        .agree-button2
          background-color #f0ffff
          border none
          padding 0 10px 0 10px
          .agree-content-all
            display inline-block
            margin 12px 2px 12px 0
            font-size 12px
            color rgba(7,17,27,0.8)
          .agree-content-count
            display inline-block
            font-size 5px
            color rgba(7,17,27,0.8)
        .agree-button3
          background-color rgba(7,17,27,0.2)
          border none
          padding 0 10px 0 10px
          .agree-content-all
            display inline-block
            margin 12px 2px 12px 0
            font-size 12px
            color rgba(7,17,27,0.8)
          .agree-content-count
            display inline-block
            font-size 5px
            color rgba(7,17,27,0.8)
      .agree-or
        padding 18px 0 18px 0
        .brand1
          color rgba(7,17,27,0.5)
        .brand2
          color green
        .text1
          color rgba(7,17,27,0.5)
        .text2
          color green
  .user-ratings
    .user-ratings-wrapper
      padding 0 18px 0 18px
      .ratings-items
        padding 18px 0 18px 0
        border-1px(rgba(7,17,27,0.1))
        display flex
        .brand
          flex 0 0 28px
          width 30px
          height  30px
          display inline-block
          border-radius 100%
          overflow hidden
        .user-info
          display inline-block
          flex 1
          margin-left 12px
          .user-info-span
            display flex
            .user-info-name
              font-size 10px
              line-height 12px
              color rgb(7,17,27)
              flex 0 0 40px
            .user-info-time
              font-size 10px
              flex 1
              text-align right
              line-height 12px
              font-weight 200
              display inline-block
              margin-right  auto
              color rgb(147,153,159)
          .user-info-deliveryTime
            font-weight 200
            display inline-block
            margin 4px 0 6px 0
            color rgb(147,153,159)
            line-height 12px
            font-size 10px
          .user-info-rating
            font-size 12px
            line-height 18px
            color rgb(7,17,27)
          .user-tag
            margin-top 8px
            .user-brand1
              font-size 12px
              line-height 16px
              color rgb(0,160,220)
              width 12px
              height 12px
            .user-brand2
              font-size 12px
              line-height 16px
              color rgb(0,160,220)
            .user-tag-rec
              display inline-block
              border 1px solid  rgba(7,17,27,0.1)
              border-radius 1px
              font-size 18px
              line-height 16px
              color rgb(147,153,159)
              padding 3px 6px
              margin-right 8px
              margin-bottom 4px
</style>
