<template>
    <div class="cartcontrol">
      <div class="icon-remove_circle_outline" v-show="food.count" @click="decreaseCount()"></div>
      <div class="count" v-show="food.count">{{food.count}}</div>
      <div class="icon-add_circle" @click="increaseCount()"></div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'cartcontrol',
  components: {
    Vue
  },
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    decreaseCount () {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 0)
        this.food.count--
      } else {
        this.food.count--
      }
    },
    increaseCount () {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 0)
        this.food.count++
      } else {
        this.food.count++
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.cartcontrol
  div
    display inline-block
  .icon-remove_circle_outline
    font-size 24px
    line-height 24px
    color rgb(0,160,220)
    vertical-align middle
  .count
    width 24px
    font-size 10px
    color rgb(147,153,159)
    text-align center
    height 24px
  .icon-add_circle
    font-size 24px
    line-height 24px
    color rgb(0,160,220)
    vertical-align middle
</style>
