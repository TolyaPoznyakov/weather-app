<script setup>
import { ref, onMounted, watch  } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import { getDayChartData, get3DayChartData  } from "@/utils/chartData";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Tooltip,
    Legend
);

const props = defineProps({
  forecast: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: "day"
  }
});

const chartRef = ref(null);
let chartInstance = null;

function renderChart() {
  if (!props.forecast) return;
  const chartData = props.mode === 'day'
      ? getDayChartData(props.forecast)
      : get3DayChartData(props.forecast);
  const ctx = chartRef.value.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0.05)");

  const datasets = [
    {
      label: "Temperature °C",
      data: chartData.temps,
      tension: 0.4,
      fill: true,
      backgroundColor: gradient,
      borderColor: "rgba(255,255,255,0.9)",
      pointBackgroundColor: "#fff",
      pointBorderColor: "transparent",
      pointRadius: 4
    }
  ];

  if (props.mode === 'day') {
    datasets.push({
      label: "Now",
      data: chartData.temps.map((t, i) =>
          i === chartData.currentIndex ? t : null
      ),
      showLine: false,
      pointRadius: 8,
      pointHoverRadius: 10,
      pointBackgroundColor: "#000000",
      pointBorderColor: "rgba(255,255,255,0.9)",
      pointBorderWidth: 2
    });
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.6)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "rgba(255,255,255,0.2)",
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" }
        },
        y: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" }
        }
      }
    }
  });
}

onMounted(() => {
  renderChart();
});

watch(() => props.mode, () => renderChart());
watch(() => props.forecast, () => renderChart());
</script>

  <template>
    <div class="chart-container">
      <h2 class="chart-title">
        {{ props.mode === 'day' ? 'Hourly Forecast' : 'Average forecast for 3 days' }}
      </h2>
      <canvas ref="chartRef"></canvas>
    </div>
  </template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 540px;
  padding: 34px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
}

.chart-title {
  color: white;
  font-size: 28px;
  font-weight: 700;
  height: 5px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>