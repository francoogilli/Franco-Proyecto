<!-- CircularChart.vue -->
<template>
    <div class="chart-title">
      <h2>Composición de la cartera</h2>
    </div>

    <div style="width: 600px; height: 500px;">
      <canvas ref="chartCanvas"></canvas>
      
    </div>
  </template>
  
  <script>
import Chart from "chart.js/auto";

export default {
  props: {
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    labels: "updateChart",
    data: "updateChart",
  },
  methods: {
    renderChart() {
      const data = {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 20,
              bottom: 20,
            },
          },
        },
      };

      this.chartInstance = new Chart(this.$refs.chartCanvas, {
        type: "pie",
        data: data,
        options: options,
      });
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.data.labels = this.labels;
        this.chartInstance.data.datasets[0].data = this.data;
        this.chartInstance.update();
      } else {
        this.renderChart();
      }
    },
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    
    }

  },
};
</script>
  <style scoped>
  .chart-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px; 
}
  </style>
  