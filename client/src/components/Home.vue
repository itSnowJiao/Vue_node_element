<template>
  <div id="main" style="width: 600px;height:400px;"></div>
</template>

<script>
export default {
  name: "home",
  data() {
      return {
      }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "基本例子"
        },
        tooltip: {},
        legend: {
          data: ["销量", "收入"]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [2134, 2025, 3693, 10888, 1068, 2440]
          },
          {
            name: "收入",
            type: "line",
            data: [525, 210, 316, 1110, 11110, 220]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
/* div {
    background-color: aquamarine;
    color: #888;
    width: 300px;
    line-height: 300px;
    margin: 200px auto;
    text-align: center;
} */
</style>