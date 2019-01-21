<template>
  <div class="viewer">
    <img :src="imgSrc" @click="click($event)">
  </div>
</template>

<script>
import ViewerStyle from 'viewerjs/dist/viewer.min.css'
import Viewer from 'viewerjs'

export default {
  name: 'Viewer',
  props: {
    imgSrc: String
  },
  methods: {
    click(evt) {
      const viewer = new Viewer(evt.target, {
        title: false,
        navbar: false,
        toolbar: {
          zoomIn: 4,
          zoomOut: 4,
          oneToOne: 4,
          reset: 4,
          // prev: 4,
          play: {
            show: 4,
            size: 'large',
          },
          // next: 4,
          rotateLeft: 4,
          rotateRight: 4,
          flipHorizontal: 4,
          flipVertical: 4,
        },
        viewed() {
          viewer.zoomTo(1)
        }
      })
      viewer.show(true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .viewer {
    cursor: pointer;
    img {
      width: 50px;
      height: 50px;
    }
  }
</style>