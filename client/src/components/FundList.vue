<template>
  <div class="fillContainer">
    <div>
      <el-form :inline="true" ref="add_data" :model="searchData">
        <!-- 筛选 -->
        <el-form-item label="按照时间筛选：">
          <el-date-picker
            v-model="searchData.startTime"
            type="datetime"
            placeholder="选择开始时间"
            default-time="12:00:00"
          ></el-date-picker>
          <el-form-item style="margin-left:10px;">至</el-form-item>
          <el-date-picker
            v-model="searchData.endTime"
            type="datetime"
            placeholder="选择结束时间"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary" @click="handleAdd" v-if="user.identity == 'manager'">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="tableData" v-if="tableData.length > 0" style="width: 100%" border>
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="date" width="250" align="center" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" width="180" align="center"></el-table-column>
        <el-table-column label="描述" prop="describe" width="180" align="center"></el-table-column>
        <el-table-column label="标记" prop="remark" width="180" align="center"></el-table-column>
        <el-table-column label="现金" prop="cash" width="140" align="center">
          <template slot-scope="scope">
            <span style="color: skyblue;">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收入" prop="income" width="140" align="center">
          <template slot-scope="scope">
            <span style="color: blue;">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支出" prop="expend" width="140" align="center">
          <template slot-scope="scope">
            <span style="color: red;">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="user.identity == 'manager'">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="user.identity == 'manager'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 对话框 -->
    <DialogFund :dialog="dialog" @update="getProfile" :formData="formData"></DialogFund>
  </div>
</template>

<script>
import DialogFund from "./DialogFund";
export default {
  name: "fund-list",
  data() {
    return {
      filterTableData: [],
      searchData: {
        startTime: "",
        endTime: ""
      },
      tableData: [],
      allTableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      paginations: {
        page_index: 1, //当前页
        total: 0, //总页
        page_size: 5, //每页数
        page_sizes: [5, 10, 15, 20], //每页条数
        layout: "total,sizes,prev,pager,next,jumper" //翻页属性
      }
    };
  },
  components: {
    DialogFund
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      // 获取表格数据
      this.$axios
        .get("/api/profile")
        .then(res => {
          //   console.log(res);
          // this.tableData = res.data;
          this.allTableData = res.data;
          this.filterTableData = res.data;
          // 设置分页数据
          this.setPaginations();
        })
        .catch(err => console.log(err));
    },
    setPaginations() {
      // 分页属性设置
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleEdit(index, row) {
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        remark: row.remark,
        cash: row.cash,
        id: row._id
      };
    },
    handleDelete(index, row) {
      this.$axios.delete(`/api/profile/delete/${row._id}`).then(res => {
        this.$message("删除成功！");
        this.getProfile();
      });
    },
    handleAdd() {
      this.dialog = {
        show: true,
        title: "编辑资金信息",
        option: "add"
      };
      this.formData = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    handleSizeChange(page_size) {
      // console.log(`每页 ${val} 条`);
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      // 设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSearch() {
      // 筛选
      if(!this.searchData.startTime || !this.searchData.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择时间'
        });
        this.getProfile();
        return;
      };
      const sTime = this.searchData.startTime.getTime();
      const eTime = this.searchData.endTime.getTime();
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= sTime && time <= eTime;
      });
      // 分页数据
      this.setPaginations();
    }
  }
};
</script>

<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 20px;
}
</style>