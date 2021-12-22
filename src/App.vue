<template>
  <div class="hackbook">
    <template v-if="step == 0">
      <h2>采集设置</h2>
      <label class="item">
        <span>书名：</span>
        <input type="text" v-model="book.name" />
      </label>
      <label class="item">
        <span>网址：</span>
        <input type="text" v-model="book.url" placeholder="http://" />
      </label>
      <label class="item">
        <span>章节：</span>
        <input type="text" v-model="book.chapter" placeholder="正在表达式" />
      </label>
      <label class="item">
        <span>内容：</span>
        <input type="text" v-model="book.content" placeholder="正在表达式" />
      </label>
      <button class="item" @click="collect">开始采集</button>
    </template>
    
    <Content v-if="testContent" :value="testContent" :book="book"></Content>

    <template v-else-if="step == 1">
      <div class="process">
        <div class="value" :style="processWidth"></div>
        
        <div style="display: none;">
          <Content v-for="item in hackChapters" :key="item.url" :value="item" :book="book" @close="item.complete = true; complete()"></Content>
        </div>
      </div>
      <div class="item">
        <button @click="downloadJson()">下载结构数据</button>
        <button @click="downloadText()">下载纯文本</button>
      </div>
    </template>

  </div>

</template>

<script>
import Content from './views/Content.vue'
import { saveAs } from 'file-saver'

export default {
  name: 'App',
  components:{
    Content
  },
  data () {
    return {
      step: 0,
      book: {
        name: document.title,
        url: document.location.href,
        chapter: null,
        content: null,
        chapters: []
      },
      testContent: null
    }
  },
  computed: {
    processWidth () {
      return {width: `${this.book.chapters.filter(item => item.complete).length * 100 / this.book.chapters.length}%`}
    },
    hackChapters() {
      return this.book.chapters.filter(item => item.url && !item.complete).filter((item, index) => index < 5)
    },
  },
  methods: {
    collect() {
      if (this.book.name && this.book.url && this.book.chapter) {
        this.book.chapters = []
        document.querySelectorAll(this.book.chapter).forEach(item => {
          this.book.chapters.push({
            name: item.innerText,
            url: item.href
          })
        })
        if (!this.book.content) {
          this.testContent = this.book.chapters[0]
        } else {
          this.testContent = null
          this.step = 1
        }
      }
    },

    complete() {
      if (this.hackChapters.length == 0) {
        setTimeout(() => {
          alert('采集完成')
        }, 1000)
      }
    },

    downloadJson() {
      var blob = new Blob([JSON.stringify(this.book)], {type: "text/plain;charset=utf-8"})
      saveAs(blob, `${this.book.name}.json`)
    },

    downloadText() {
      var text = this.book.chapters.map(item => item.name + '\n\n' + (item.text || []).map(x => '　　' + x).join('\n\n')).join('\n\n\n')
      var blob = new Blob([text], {type: "text/plain;charset=utf-8"})
      saveAs(blob, `${this.book.name}.txt`)
    }
  },
  mounted() {
  }
}
</script>


<style scoped>
.hackbook {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: 60%;
  min-width: 300px;
  background: #fff;

  z-index: 999999;
  
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
.hackbook h2 {
  text-align: center;
  margin: 10px;
}
.hackbook .item {
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 5px 10px;
}
.hackbook .item + .item {
  margin-top: 5px;
}
.hackbook .item span {
  flex: none;
  white-space: nowrap;
  user-select: none;
}

.hackbook .item input{
  flex: 1;
  border: none;
  outline: none;
  font-size: inherit;
}
.hackbook button.item{
  justify-content: center;
}

.hackbook .item button{
  flex: 1;
}
.hackbook .item button + button{
  margin-left: 10px;
}

.hackbook .process {
  width: 100%;
  height: 10px;
  border: 1px solid #646cff;
}
.hackbook .process .value {
  width: 0%;
  height: 100%;
  background: #646cff;
}
</style>
