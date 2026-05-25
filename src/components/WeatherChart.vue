<script setup>
import { ref, onMounted, watch  } from "vue";
import { useI18n } from "vue-i18n"
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

const { t } = useI18n()
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
      label: t("chart.temperature"),
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
      label: t("chart.now"),
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
        {{ props.mode === 'day' ? t("chart.hourlyForecast") : t("chart.threeDayAverage") }}
      </h2>
      <canvas ref="chartRef"></canvas>
    </div>
  </template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  min-height: 490px;
  padding: 35px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
  overflow: hidden;
}

.chart-title {
  color: white;
  font-size: clamp(22px, 5vw, 28px);
  font-weight: 700;
  margin-bottom: 24px;
}

canvas {
  width: 100% !important;
  height: 400px !important;
}

@media (max-width: 768px) {
  .chart-container {
    min-height: 420px;
    padding: 24px;
  }

  canvas {
    height: 320px !important;
  }
}

@media (max-width: 480px) {
  .chart-container {
    min-height: 340px;
    padding: 18px;
    border-radius: 24px;
  }

  canvas {
    height: 260px !important;
  }
}



@media (max-width: 600px) {
  .chart-container {
    transform: scale(0.95);
  }
}

@media (max-width: 420px) {
  .chart-container {
    transform: scale(0.90);
  }
}
</style>