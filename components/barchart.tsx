import { HorizontalBar } from "react-chartjs-2";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  maintainAspectRatio: false,
};

const HorizontalBarChart = ({ data, labels, heading }) => {
  const dataSet = {
    labels: labels,
    datasets: [
      {
        label: heading,
        data: data,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
  return <HorizontalBar data={dataSet} options={options} height={1000} />;
};

export default HorizontalBarChart;
