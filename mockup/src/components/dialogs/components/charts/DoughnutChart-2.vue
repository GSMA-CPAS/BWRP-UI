  <div>
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
<script>
import { Doughnut } from 'vue-chartjs';
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels';

export default {
  extends: Doughnut,
  components: {
    ChartJsPluginDataLabels,
  },
  data(){
    return {
      data: {
        labels: ['DATA', 'VOICE', 'SMS'],
        datasets: [{
          labels: {
            render: 'label'
          },
          data: ['55', '30', '15'],
          backgroundColor: [
            'rgb(134,92,61)',
            'rgb(235,126,54)',
            'rgb(231,192,82)',
          ],
          borderColor: [
            'rgb(134,92,61)',
            'rgb(235,126,54)',
            'rgb(231,192,82)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        // labels: {
        //   render: 'percentage',
        //   fontColor: ['green', 'white', 'red'],
        //   precision: 2
        // }
        plugins: {
          datalabels: {
            color: '#ffffff',
            formatter: function (value) {
              return Math.round(value) + '%';
            },
            font: {
              weight: 'bold',
              size: 15,
            }
          }
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }

}
</script>

<style scoped>

</style>