<template>
  <iframe
    v-if="isLoad && value.url"
    :data-load-times="loadTimes"
    :src="value.url"
    @load="onLoad(true)"
    class="iframe"
    frameborder="0"
  ></iframe>
</template>

<script>
export default {
  name: 'Content',
  emits: ['close'],
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    book: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loadTimes: 1,
      isLoad: true
    }
  },
  methods: {
    onLoad(waiting) {
      if (waiting) {
        this.now = Date.now()
      }

      if (this.book.content) {
        let el = this.$el.contentWindow.document.querySelector(this.book.content)

        this.value.text = el.innerText.split('\n')
          .map(item => item.trim()).filter(item => item)
        if (this.value.text.length == 1 && el.children.length) {
          console.log(el, el.innerText, el.children)
          let txt = []
          for (let i = 0; i < el.children.length; i++) {
            txt.push(el.children[i].innerText)
          }
          txt = txt.filter(item => item).map(item => item.trim()).filter(item => item)
          if (txt.length) {
            this.value.text = txt
          }
        }

        if (!this.value.text.length) {
          if ((Date.now() - this.now) < 10000) {
            setTimeout(this.onLoad, 1000);
          } else if (this.loadTimes > 3) {

          } else {
            this.loadTimes++
            this.isLoad = false
            setTimeout(() => {
              this.isLoad = true
            }, 300)
          }
        } else {
          this.$emit('close')
        }
      }
    }
  }
}
</script>

<style scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  position: fixed;
  left: 0;
  top: 0;
}
</style>