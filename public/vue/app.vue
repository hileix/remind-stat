<template>
  <div id="wrap">
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
import axios from 'axios'
import qs from 'qs'
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
      allTime: 0, // 总时间
      taskId: 0, // 任务id
      midTime: 0, // 时间还没结束，就点击了完成按钮的时间
    }
  },
  methods: {
    // 继续计时
    startMoreTiming (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        axios.post('http://localhost:3041/task/delay', qs.stringify({
          taskId: this.taskId,
          delayRank: this.delayCount + 1,
          delayTime: this.toS(this.form.time)
        })).then((data) => {
          data = data.data
          if (data.code !== 1) {
            alert('申请延时失败！')
            return
          }
          this.midTime = 0
          this.delayCount++ // 添加延时次数
          this.allTime += this.toS(this.form.time)
          this.status = 'more' // 修改状态为 more
          this.timing()
        }).catch((e) => {
          alert(e)
        })
      })
    },
    // 点击 申请延时 按钮
    reqMoreTime () {
      this.isShowMoreInput = !this.isShowMoreInput
      // 显示了输入更多时间的输入框
      if (this.isShowMoreInput) {
        window.resizeTo(400, 239)
      } else {
        window.resizeTo(400, 160)
      }
      this.form.time = ''
    },
    // 完成任务
    finishTask () {
      clearInterval(timer)
      if (this.status === 'one') {
        this.allTime = this.midTime
      } else {
        this.allTime = this.allTime - this.toS(this.form.time) + this.midTime
      }
      axios.post('http://localhost:3041/task/finish', qs.stringify({
        taskId: this.taskId,
        allTime: this.allTime,
        delayCount: this.delayCount
      })).then((data) => {
        data = data.data
        if (data.code !== 1) {
          alert('完成任务失败！')
          return
        }
        // 完成任务成功后，才能显示 表单
        this.showForm()
        this.allTime = 0
        
      }).catch((e) => {
        alert(e)
      })
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
      window.resizeTo(400, 109)
      window.moveTo(left, top)
      // html5 的 Notification 对象
      let myNotification = new Notification('提示', {
        body: '开始计时'
      })
    },
    // 显示表单
    showForm () {
      this.flag = true
      window.resizeTo(400, 209)
      window.moveTo(0, 0)
    },
    // 开始计时
    startTiming (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        // 创建任务
        axios.post('http://localhost:3041/task/create', qs.stringify({
          name: that.form.name,
          time: that.toS(that.form.time)
        })).then((data) => {
          console.log(data)
          data = data.data
          if (data.code !== 1) {
            alert('任务创建失败！')
            return
          }
          that.taskId = data.data.insertId
          // 创建任务成功之后，才开始计时
          that.delayCount = 0 // 延时次数置0
          that.status = 'one' // 修改状态为 one
          that.allTime += that.toS(that.form.time) // 增加总时间
          that.timing()
        }).catch((e) => {
          alert(e)
        })
      })
    },
    // 将分钟转为秒，或将字符串"s12"转为"12"秒
    toS (time) {
      if (time.indexOf('s') === 0) {
        return parseInt(time.slice(1))
      } else {
        return parseInt(time)*60
      }
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
          let myNotification = new Notification('提示', {
            body: '时间到'
          })
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

        that.midTime++
      }, 1000)
    }
  }
}
</script>
