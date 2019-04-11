<template>
  <div class="img-lazyload">
    <template v-if="loadStatus === 'loading'">
      <div class="loading">
        <svg-icon icon-class="loading" class="loading"/>
      </div>
    </template>
    <template v-else-if="loadStatus === 'loaded'">
      <div class="loaded">
        <img :src="imgSrc">
      </div>
    </template>
    <template v-else-if="loadStatus === 'error'">
      <div class="error">
        <svg-icon icon-class="img-load-error" class="load-error"/>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ImageLazyload',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imgSrc: '',
      loadStatus: 'loading'
    }
  },
  created() {
    const newImg = new Image()
    newImg.src = this.url
    newImg.onload = () => {
      this.loadStatus = 'loaded'
      this.imgSrc = this.url
    }
    newImg.onerror = () => {
      this.loadStatus = 'error'
    }
  }
}
</script>

<style lang="scss" scoped>
  .svg-icon {
    &.loading {
      animation: rotate 1s ease infinite;
      font-size: 24px;
    }
    &.load-error {
      font-size: 50px;
      color: #eaeaea;
    }
  }
  @keyframes rotate {
    0% { transform: rotate(0); }
    100% { transform: rotate(360deg); }
  }
</style>
