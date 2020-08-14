
<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          <img :src="logo" alt="logo"> Form Generator
          <a class="github" href="https://github.com/JakHuang/form-generator" target="_blank">
            <img src="https://github.githubassets.com/pinned-octocat.svg" alt>
          </a>
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon icon-class="component" />
              {{ item.title }}
            </div>
            <draggable
              class="components-draggable"
              :list="item.list"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent"
              draggable=".components-item"
              :sort="false"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <div class="components-body">
                  <svg-icon :icon-class="element.__config__.tagIcon" />
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <el-button icon="el-icon-video-play" type="text" @click="run">
          运行
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>
      </div>
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
              <draggable-item
                v-for="(item, index) in drawingList"
                :key="item.renderKey"
                :drawing-list="drawingList"
                :current-item="item"
                :index="index"
                :active-id="activeId"
                :form-conf="formConf"
                @activeItem="activeFormItem"
                @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete"
              />
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              从左侧拖入或点选组件进行表单设计
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>

    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
    />

    <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(formData)"
      @refresh="refreshJson"
    />
    <code-type-dialog
      :visible.sync="dialogVisible"
      title="选择生成类型"
      :show-file-name="showFileName"
      @confirm="generate"
    />
    <input id="copyNode" type="hidden">
  </div>
</template>

<script>
// 拖拽
import draggable from 'vuedraggable'
// 节流 防抖工具
import { debounce } from 'throttle-debounce'
// 保存下载插件
import { saveAs } from 'file-saver'
// 复制
import ClipboardJS from 'clipboard'
// 
import render from '@/components/render/render'
// 运行预览
import FormDrawer from './FormDrawer'
// 查看json
import JsonDrawer from './JsonDrawer'
// 右边配置
import RightPanel from './RightPanel'
// 左边 右边配置
import {
  inputComponents, selectComponents, layoutComponents, formConf
} from '@/components/generator/config'
// 
import {
  exportDefault, beautifierConf, isNumberStr, titleCase, deepClone
} from '@/utils/index'
//
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import drawingDefalut from '@/components/generator/drawingDefalut'
import logo from '@/assets/logo.png'
import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from './DraggableItem'
import {
  getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db'
import loadBeautifier from '@/utils/loadBeautifier'

let beautifier
const emptyActiveData = { style: {}, autosize: {} }
let oldActiveId
let tempActiveData
const drawingListInDB = getDrawingList()
const formConfInDB = getFormConf()
const idGlobal = getIdGlobal()

export default {
  components: {
    draggable,
    render,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    CodeTypeDialog,
    DraggableItem
  },
  data() {
    return {
      logo,
      idGlobal,
      formConf,
      inputComponents,
      selectComponents,
      layoutComponents,
      labelWidth: 100,
      drawingList: drawingDefalut,
      drawingData: {},
      activeId: drawingDefalut[0].formId,
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: drawingDefalut[0],
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      leftComponents: [
        {
          title: '输入型组件',
          list: inputComponents
        },
        {
          title: '选择型组件',
          list: selectComponents
        },
        {
          title: '布局型组件',
          list: layoutComponents
        }
      ]
    }
  },
  created(){
    console.log(this.leftComponents,this.selectComponents)
  },
  computed: {
  },
  watch: {
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function (val, oldVal) {
      if (
        this.activeData.placeholder === undefined
        || !this.activeData.__config__.tag
        || oldActiveId !== this.activeId
      ) {
        return
      }
      this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
    },
    activeId: {
      handler(val) {
        oldActiveId = val
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        this.saveDrawingListDebounce(val)
        if (val.length === 0) this.idGlobal = 100
      },
      deep: true
    },
    idGlobal: {
      handler(val) {
        this.saveIdGlobalDebounce(val)
      },
      immediate: true
    }
  },
  mounted() {
    if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
      this.drawingList = drawingListInDB
    } else {
      this.drawingList = drawingDefalut
    }
    this.activeFormItem(this.drawingList[0])
    if (formConfInDB) {
      this.formConf = formConfInDB
    }
    loadBeautifier(btf => {
      beautifier = btf
    })
    //复制
    const clipboard = new ClipboardJS('#copyNode', {
      text: trigger => {
        const codeStr = this.generateCode()
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return codeStr
      }
    })
    clipboard.on('error', e => {
      this.$message.error('代码复制失败')
    })
  },
  methods: {
    activeFormItem(currentItem) {
      this.activeData = currentItem
      this.activeId = currentItem.__config__.formId
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }
    },
    addComponent(item) {
      const clone = this.cloneComponent(item)
      this.drawingList.push(clone)
      this.activeFormItem(clone)
    },
    cloneComponent(origin) {
      const clone = deepClone(origin)
      const config = clone.__config__
      config.span = this.formConf.span // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone)
      clone.placeholder !== undefined && (clone.placeholder += config.label)
      tempActiveData = clone
      return tempActiveData
    },
    createIdAndKey(item) {
      const config = item.__config__
      config.formId = ++this.idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${this.idGlobal}`
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`
        !Array.isArray(config.children) && (config.children = [])
        delete config.label // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map(childItem => this.createIdAndKey(childItem))
      }
      return item
    },

    // 表单配置数据
    AssembleFormData() {
      this.formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf
      }
      console.log(this.formData)
    },
    generate(data) {
      // 拼接下载，复制，预览代码
      const func = this[`exec${titleCase(this.operationType)}`]
      console.log(func)
      console.log(data)
      this.generateConf = data
      func && func(data)
    },
    // 预览代码
    execRun(data) {
      this.AssembleFormData()
      this.drawerVisible = true
    },
    // 下载
    execDownload(data) {
      const codeStr = this.generateCode()
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, data.fileName)
    },
    // 点击复制
    execCopy(data) {
      document.getElementById('copyNode').click()
    },
    // 清空
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
        () => {
          this.drawingList = []
          this.idGlobal = 100
        }
      )
    },
    // 复制组件
    drawingItemCopy(item, list) {
      let clone = deepClone(item)
      clone = this.createIdAndKey(clone)
      list.push(clone)
      this.activeFormItem(clone)
    },
    // 删除组件
    drawingItemDelete(index, list) {
      list.splice(index, 1)
      this.$nextTick(() => {
        const len = this.drawingList.length
        if (len) {
          this.activeFormItem(this.drawingList[len - 1])
        }
      })
    },
    // 生产代码
    generateCode() {
      const { type } = this.generateConf
      this.AssembleFormData()
      const script = vueScript(makeUpJs(this.formData, type))
      const html = vueTemplate(makeUpHtml(this.formData, type))
      const css = cssStyle(makeUpCss(this.formData))
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    // json
    showJson() {
      this.AssembleFormData()
      this.jsonDrawerVisible = true
    },
    // 下载
    download() {
      this.dialogVisible = true
      this.showFileName = true
      this.operationType = 'download'
    },
    // 运行预览代码
    run() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'run'
    },
    // 复制
    copy() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'copy'
    },

    // 切换右边组件类型
    tagChange(newTag) {
      console.log(newTag)
      newTag = this.cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = this.activeData.__vModel__
      config.formId = this.activeId
      config.span = this.activeData.__config__.span
      this.activeData.__config__.tag = config.tag
      this.activeData.__config__.tagIcon = config.tagIcon
      this.activeData.__config__.document = config.document
      if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = this.activeData.__config__.defaultValue
      }
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key]
        }
      })
      this.activeData = newTag
      this.updateDrawingList(newTag, this.drawingList)
    },
    // 切换右边组件触发
    updateDrawingList(newTag, list) {
      console.log(newTag,list)
      const index = list.findIndex(item => item.__config__.formId === this.activeId)
      if (index > -1) {
        list.splice(index, 1, newTag)
      } else {
        list.forEach(item => {
          if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children)
        })
      }
    },
    // json刷新
    refreshJson(data) {      
      this.drawingList = deepClone(data.fields)
      console.log(this.drawingList)
      delete data.fields
      this.formConf = data
    }
  }
}
</script>

<style lang='scss'>
@import '@/styles/home';
</style>
