import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
import { Audio } from "react-loader-spinner";

type Props = {
  close: () => void;
};

export default function SoundWindow(props: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showGauge, setShowGauge] = useState(false);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip
  );

  useEffect(() => {
    setShowGauge(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div className="z-10 bg-white absolute top-10 left-10 w-96 shadow-md border rounded-md px-4 py-2 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-nexa font-bold text-xl">StarBucks Listeners</span>
        <svg
          onClick={() => props.close()}
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 hover:bg-gray-200 transition-colors cursor-pointer rounded-full p-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      {isLoading ? (
        <div className="py-4 flex items-center justify-center">
          <Audio height={100} width="300" color="#6366f1" ariaLabel="loading" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center mt-4">
            <div className="w-60 my-4">
              {showGauge && (
                <GaugeChart
                  needleColor="#818cf8"
                  needleBaseColor="#3730a3"
                  formatTextValue={() => "60 dB"}
                  percent={0.6}
                  colors={["#16a34a", "#dc2626"]}
                  textColor="#000"
                  nrOfLevels={5}
                  id="gauge-chart1"
                />
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-4 bg-gray-100 p-2 rounded-md">
              The sound level has been below <strong>70 dB</strong> for the last
              6 hours. Over the last 7 days the sound level went abouve{" "}
              <strong>80 dB</strong> 64 times.
            </p>
          </div>
          <div>
            <Bar
              height={150}
              datasetIdKey="id"
              options={{
                scales: {
                  yAxes: {
                    ticks: {
                      display: false,
                    },
                    grid: {
                      color: "#fff",
                      drawBorder: false,
                    },
                  },
                  xAxes: {
                    grid: {
                      color: "#fff",
                    },
                  },
                },
              }}
              data={{
                labels: ["22:00", "23:00", "0:00", "1:00", "2:00"],
                datasets: [
                  {
                    label: "Sound level",
                    data: [60, 70, 20, 50, 10],
                    borderColor: "#4f46e5",
                    borderWidth: 3,
                    backgroundColor: "#818cf8",
                  },
                ],
              }}
            ></Bar>
            <Line
              className="mt-2"
              height={150}
              datasetIdKey="id"
              options={{
                scales: {
                  yAxes: {
                    ticks: {
                      display: false,
                    },
                    beginAtZero: true,
                    grid: {
                      color: "#fff",
                      drawBorder: false,
                    },
                  },
                  xAxes: {
                    grid: {
                      color: "#fff",
                    },
                  },
                },
              }}
              data={{
                labels: ["18/5", "19/5", "20/5", "20/5", "21/5"],
                datasets: [
                  {
                    label: "Sound level",
                    data: [60, 70, 20, 50, 10],
                    borderColor: "#4f46e5",
                    borderWidth: 3,
                    backgroundColor: "#818cf8",
                  },
                ],
              }}
            ></Line>
          </div>
          <div className="flex justify-between mt-4">
            <span className="flex items-center text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 animate-spin mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="mt-0.5">Updated 10 seconds ago</span>
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
              <span className="mt-0.5">44ms</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
