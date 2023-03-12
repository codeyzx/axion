import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const optionsChart = {
  responsive: true,
  maintainAspectRatio: false,
};

export function SalesChart({ auction }) {
  const nowDay = parseInt(dayjs().format("D"));
  const nowMonth = dayjs().format("MMM");
  const labels = [
    `${dayjs().subtract(6, "day").format("D")} ${nowMonth}`,
    `${dayjs().subtract(5, "day").format("D")} ${nowMonth}`,
    `${dayjs().subtract(4, "day").format("D")} ${nowMonth}`,
    `${dayjs().subtract(3, "day").format("D")} ${nowMonth}`,
    `${dayjs().subtract(2, "day").format("D")} ${nowMonth}`,
    `${dayjs().subtract(1, "day").format("D")} ${nowMonth}`,
    `${dayjs().format("D")} ${nowMonth}`,
    `${nowDay} ${nowMonth}`,
  ];

  console.log(auction);

  const dataBidders = () => {
    const sorted = auction.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    console.log("sorted: ", sorted);
    var data = [];
    for (let i = 0; i < sorted.length; i++) {
      if (sorted.length < 7) {
        data.push(sorted[i].bidders_count);
      }
    }
    console.log("data less than 7: ", data);
    return data;

    // const data = [];
    // for (let i = 0; i < 7; i++) {
    //   // data.push(auction[i].bidders.length);
    //   // sort by date
    //   const sorted = auction.sort((a, b) => {
    //     return new Date(a.createdAt) - new Date(b.createdAt);
    //   });
    //   data.push(sorted[i].bidders.length);
    // }
    // return data;
  };

  const data = {
    labels,
    datasets: [
      {
        // data: [30000, 36000, 24000, 42000, 38000, 62000, 36000],
        data: dataBidders(),
        label: "Bidders",
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.4)",
      },
    ],
  };
  return <Line options={options} data={data} className="text-pur" />;
}

// export function SalesChart() {
//   const nowDay = plabelsarseInt(dayjs().format("D"))
//   const nowMonth =dayjs().format("MMM")
//   const labels = [
//     `${dayjs().subtract(6, 'day').format("D")} ${nowMonth}`,
//     `${dayjs().subtract(5, 'day').format("D")} ${nowMonth}`,
//     `${dayjs().subtract(4, 'day').format("D")} ${nowMonth}`,
//     `${dayjs().subtract(3, 'day').format("D")} ${nowMonth}`,
//     `${dayjs().subtract(2, 'day').format("D")} ${nowMonth}`,
//     `${dayjs().subtract(1, 'day').format("D")} ${nowMonth}`,
//     `${nowDay} ${nowMonth}`,
//   ]

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Penjualan",
//         data: [30000, 36000, 24000, 42000, 38000, 62000, 36000],
//         borderColor: "rgb(147, 51, 234)",
//         backgroundColor: "rgba(147, 51, 234, 0.4)",
//       },
//     ],
//   }
//   return <Line options={options} data={data} className="text-pur" />;
// }
