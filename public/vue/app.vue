<template>
  <div>
    <!-- 添加名称和时间 -->
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" v-show="flag">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="时间(分)" prop="time">
        <el-input v-model="form.time" placeholder="请输入预期完成时间（单位为 分）"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="startTiming('form')">开始计时</el-button>
      </el-form-item>
    </el-form>
    <!-- 倒计时 -->
    <div v-show="!flag" class="time-container">
      <!-- <div style="-webkit-app-region: drag">拖拽</div> -->
      <!-- 倒计时 -->
      <div class="count-down">
        <span class="time-min">{{ time.min }}</span>
        <span>分</span>
        <span class="time-s">{{ time.s }}</span>
        <span>秒</span>
        <div>
          <el-button size="small" @click="finishTask" type="success">完成任务</el-button>
          <el-button size="small" v-show="reqMoreTimeBtn" type="warning" @click="reqMoreTime">申请延时</el-button>
        </div>
        <span class="delay-count" v-show="status === 'more'">{{ delayCount }}</span>
      </div>
      <!-- 输入更多的时间 -->
      <div class="input-moretime" v-show="isShowMoreInput">
        <el-form ref="more-time" :rules="moreTimeRules" :model="form">
          <el-form-item prop="time">
            <el-input v-model="form.time" placeholder="请输入延时时间（单位为 分）">
              <el-button slot="append" type="primary" @click="startMoreTiming('more-time')">延时/分</el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style>
.count-down {
  text-align: center;
  position: relative;
}
.count-down .delay-count {
  background: #409eff;
  color: #fff;
  text-align: center;
  width: 20px;
  line-height: 20px;
  border-radius: 50%;
  position: absolute;
  right: 10px;
  top: 10px;
}
.time-min, .time-s {
  font-size: 48px;
}
.input-moretime {
  margin-top: 10px;
}
</style>


<script>
import moment from 'moment'
let timer
export default {
  name: 'app',
  data () {
    return {
      form: { // 表单对象
        name: '',
        time: ''
      },
      rules: { // 验证规则
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        time: [{ required: true, message: '请输入预期完成时间', trigger: 'blur' }]
      },
      moreTimeRules: { // 延时表单验证规则
        time: [{ required: true, message: '请输入延时时间', trigger: 'blur' }]
      },
      flag: true, // 是否显示 表单 界面
      time: { // 时间
        min: '',
        s: ''
      },
      reqMoreTimeBtn: false, // 是否显示 申请延时 按钮
      delayCount: 0, // 延时次数
      status: 'one', // 当前状态：one 表示是"第一次"开始任务，没有进行延时；more 表示当前状态为"延时"状态
      isShowMoreInput: false, // 是否显示输入更多时间的输入框
    }
  },
  methods: {
    // 继续计时
    startMoreTiming (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        this.delayCount++ // 添加延时次数
        this.status = 'more' // 修改状态为 more
        this.timing()
      })
    },
    // 点击 申请延时 按钮
    reqMoreTime () {
      this.isShowMoreInput = !this.isShowMoreInput
      // 显示了输入更多时间的输入框
      if (this.isShowMoreInput) {
        window.resizeTo(400, 230)
      } else {
        window.resizeTo(400, 160)
      }
      this.form.time = ''
    },
    // 完成任务
    finishTask () {
      this.showForm()
    },
    // 显示倒计时界面
    showTime () {
      this.flag = false
      this.isShowMoreInput = false
      // 第一次开始任务时，重置延时次数为0
      if (this.status === 'one') {
        this.delayCount = 0
      }
      let left = window.screen.width - document.body.clientWidth
      let top = 0
      window.resizeTo(400, 160)
      window.moveTo(left, top)
      // html5 的 Notification 对象
      /* let myNotification = new Notification('提示', {
        body: '开始计时'
      }) */
    },
    // 显示表单
    showForm () {
      this.flag = true
      window.resizeTo(400, 200)
      window.moveTo(0, 0)
    },
    // 开始计时
    startTiming (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        this.delayCount = 0 // 延时次数置0
        this.status = 'one' // 修改状态为 one
        this.timing()
      })
    },
    // 计时
    timing () {
      this.showTime()
      this.reqMoreTimeBtn = false
      clearInterval(timer)
      const that = this
      let allSecond = 0 // 总秒数
      // 前缀为 's' 时，单位为秒：'s12' 表示 12 秒
      if (that.form.time.indexOf('s') === 0) {
        allSecond = parseInt(that.form.time.slice(1))
      } else {
        allSecond = that.form.time*60
      }
      // 初始化 min 和 s
      let numMin = Math.floor(allSecond/60)
      this.time.min = numMin < 10 ? '0' + numMin : '' + numMin
      let numS = allSecond%60
      this.time.s = numS < 10 ? '0' + numS : '' + numS
      // 定时器
      timer = setInterval(() => {
        if (allSecond-- === 0) {
          clearInterval(timer)
          /* let myNotification = new Notification('提示', {
            body: '时间到'
          }) */
          that.reqMoreTimeBtn = true
          return
        }
        // 得出 分
        let numMin = Math.floor(allSecond/60)
        let curMinString = numMin < 10 ? '0' + numMin : '' + numMin
        that.time.min = curMinString
        // 得出 秒
        let numS = allSecond%60
        let curSString = numS < 10 ? '0' + numS : '' + numS
        that.time.s = curSString
      }, 1000)
    }
  }
}
</script>
