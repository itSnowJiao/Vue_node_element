<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.show"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="form">
      <el-form
        ref="form"
        :model="formData"
        :rules="form_rules"
        label-width="120px"
        style="margin: 10px;width: auto;"
      >
        <el-form-item label="收支类型：">
          <el-select v-model="formData.type" placeholder="收支类型">
            <el-option
              v-for="(formtype,index) in format_type_list"
              :key="index"
              :label="formtype"
              :value="formtype"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收支描述：" prop="describe">
          <el-input v-model="formData.describe" placeholder="收支描述" type="describe"></el-input>
        </el-form-item>
        <el-form-item label="收入：" prop="income">
          <el-input v-model="formData.income" placeholder="收入" type="income"></el-input>
        </el-form-item>
        <el-form-item label="支出：" prop="expend">
          <el-input v-model="formData.expend" placeholder="支出" type="expend"></el-input>
        </el-form-item>
        <el-form-item label="现金：" prop="cash">
          <el-input v-model="formData.cash" placeholder="现金" type="cash"></el-input>
        </el-form-item>
        <el-form-item label="标记：" prop="remark">
          <el-input v-model="formData.remark" placeholder="标记" type="textarea"></el-input>
        </el-form-item>
        <el-form-item class="text_right">
          <el-button @click="dialog.show = false">取消</el-button>
          <el-button @click="onSubmit('form')" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "dialog-fund",
  data() {
    return {
      // 将formData提升到父组件中，通过props传值给子组件
      // formData: {
      //   type: "",
      //   describe: "",
      //   income: "",
      //   expend: "",
      //   cash: "",
      //   remark: "",
      //   id: ""
      // },
      format_type_list: [
        "提现",
        "提现手续费",
        "充值",
        "优惠券",
        "充值礼券",
        "转账"
      ],
      form_rules: {
        describe: [{ required: true, message: "描述不能为空", trigger: 'blur' }],
        cash: [{ required: true, message: "账户现金不能为空", trigger: 'blur' }],
        expend: [{ required: true, message: "支出不能为空", trigger: 'blur' }],
        income: [{ required: true, message: "收入不能为空", trigger: 'blur' }]
      }
    };
  },
  props: {
    dialog: Object,
    formData: Object
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if(valid) {
          // 判单是编辑还是添加，对应不同的接口
          const url = this.dialog.option == 'add' ? 'add' : `edit/${this.formData.id}`;
          this.$axios.post(`/api/profile/${url}`, this.formData).then(res => {
            // 添加成功
            this.$message({
              message: '数据添加成功',
              type: 'success'
            });

            // 隐藏对话框
            this.dialog.show = false;

            // 注册一个自动刷新的事件并在父组件中调用
            this.$emit('update');
          })
        }
      })
    }
  }
};
</script>

<style scoped>

</style>

