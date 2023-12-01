import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function MixedChart({ bardata, linedata }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Active Projects",
        type: "line",
        data: linedata?.map((data) => data?.statusCount),
        fill: false,
        borderColor: "red",
        tension: 0.4,
        backgroundColor: "red",
        borderWidth: 2,
      },
      {
        label: "Total Projects",
        type: "bar",
        data: bardata?.map((data) => data?.monthCount),
        borderWidth: 0.5,
        borderColor: "black",
        backgroundColor: "#3D5A80",
        barThickness: 20,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          color: "red",
          font: {
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          color: "red",
          font: {
            size: 14,
          },
        },
        grid: {
          color: "lightgray",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <div className="border p-2" style={{minHeight:"53vh"}}>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}
export default MixedChart;
