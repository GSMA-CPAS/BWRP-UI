  <div>
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
<script>
import {Doughnut} from 'vue-chartjs';
export default {
  extends: Doughnut,
  props: {
    chartData: Array
  },
  data() {
    return {
      data: {
        labels: ['DATA', 'MTC', 'MOC', 'SMS'],
        datasets: [{
          label: 'dddd',
          data: this.chartData,
          backgroundColor: [
            'rgb(48,88,46)',
            'rgb(9,180,13)',
            'rgb(147,245,139)',
            'rgb(189,245,185)',
          ],
          borderColor: [
            'rgb(48,88,46)',
            'rgb(9,180,13)',
            'rgb(147,245,139)',
            'rgb(189,245,185)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          datalabels: {
            color: '#ffffff',
            formatter: function(value) {
              return value>1.0?Math.round(value) + '%':'';
            },
            font: {
              weight: 'bold',
              size: 15,
            }
          }
        }
      }
    };
  },
  mounted() {
    this.renderChart(this.data, this.options);
  }

};
</script>

<style scoped>

</style>
