import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
import { Audio } from "react-loader-spinner";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import MongoWrapper from "~/modules/mongodb.server";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
} from "chart.js";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
type Props = {};

type LoaderData = {
  device: {
    _id: string;
    name: string;
    created_at: string;
    location: {
      lat: number;
      lng: number;
    };
    ping: {
      latency: number | null;
      last: Date;
    };
  };
  samplesLast15Minutes: [];
};

export const loader: LoaderFunction = async ({ params }) => {
  const device = await MongoWrapper.devices().findOne({
    name: {
      $eq: params.deviceName,
    },
  });
  const samplesLast15Minutes = await MongoWrapper.samplesAggregate(
    params.deviceName as string,
    15
  );

  const totalSamplesCount = await MongoWrapper.sampleCountSince(
    params.deviceName as string,
    new Date(0)
  );

  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setMinutes(0);
  const totalSamplesCountToday = await MongoWrapper.sampleCountSince(
    params.deviceName as string,
    today
  );

  let anHourAgo = new Date();
  anHourAgo.setHours(anHourAgo.getHours() - 1);

  const totalSamplesCountLastHour = await MongoWrapper.sampleCountSince(
    params.deviceName as string,
    new Date(anHourAgo)
  );

  const samples24Hours = await MongoWrapper.samplesPer24Hours(
    params.deviceName as string
  );

  const lastDb = await MongoWrapper.lastDb(params.deviceName as string);
  return json({
    device,
    samplesLast15Minutes,
    totalSamplesCount,
    totalSamplesCountLastHour,
    totalSamplesCountToday,
    lastDb,
    samples24Hours,
  });
};

export default function Device(props: Props) {
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
  const [showGauge, setShowGauge] = useState(false);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip
  );

  const data = useLoaderData<LoaderData>();

  useEffect(() => {
    setShowGauge(true);
  }, []);
  let navigate = useNavigate();

  const lastPingDuration = dayjs.duration(
    dayjs().diff(dayjs(data.device.ping.last))
  );

  let average15 = data.samplesLast15Minutes
    .map((sample) => sample.average)
    .reverse()
    .map((n) => 180 * Math.log10(n / 55));
  let average15Label = data.samplesLast15Minutes
    .map(
      (sample) =>
        sample._id.hour +
        ":" +
        ("0" + sample._id.minute).slice(-2) +
        ":" +
        ("0" + sample._id.second).slice(-2)
    )
    .reverse();

  let average24Hour = data.samples24Hours
    .map((sample) => sample.average)
    .reverse()
    .map((n: number) => 180 * Math.log10(n / 55));
  let average24HourLabel = data.samples24Hours
    .map(
      (sample) => sample._id.hour + ":" + ("0" + sample._id.minute).slice(-2)
    )
    .reverse();

  let gaugePercent = (data.lastDb.average - 40) / 50;

  const online = lastPingDuration.asMinutes() < 5;

  return (
    <div className="z-10 bg-white absolute top-10 left-10 w-96 shadow-md border rounded-md py-2 flex flex-col">
      <div className="flex items-center justify-between pl-4 pr-2 mb-4">
        <span className="font-nexa font-bold text-xl">{data.device.name}</span>
        <div className="flex">
          <Form method="get">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 hover:bg-gray-200 transition-colors cursor-pointer rounded-full p-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </Form>
          <svg
            onClick={() => navigate("/")}
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 hover:bg-gray-200 transition-colors cursor-pointer rounded-full p-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
      <div
        style={{ maxHeight: "calc(100vh - 216px)" }}
        className="overflow-y-auto px-4"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-60 my-4">
            {showGauge && (
              <GaugeChart
                animate={false}
                needleColor="#818cf8"
                needleBaseColor="#3730a3"
                formatTextValue={() => Math.round(data.lastDb.average) + " dB"}
                percent={gaugePercent}
                colors={["#16a34a", "#dc2626"]}
                textColor="#000"
                nrOfLevels={5}
                id="gauge-chart1"
              />
            )}
          </div>
        </div>
        <div>
          <Bar
            height={150}
            datasetIdKey="id"
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return Math.round(Number(context.raw)) + " dB";
                    },
                  },
                },
              },
              scales: {
                yAxes: {
                  ticks: {
                    display: false,
                  },
                  suggestedMin: 50,
                  suggestedMax: 120,
                  beginAtZero: false,
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
              labels: average15Label,
              datasets: [
                {
                  label: "Sound level",
                  data: average15,
                  borderColor: "#4f46e5",
                  borderWidth: 3,
                  backgroundColor: "#818cf8",
                },
              ],
            }}
          ></Bar>
          <Line
            className="mt-8"
            height={150}
            datasetIdKey="id"
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return Math.round(Number(context.raw)) + " dB";
                    },
                  },
                },
              },
              scales: {
                yAxes: {
                  ticks: {
                    display: false,
                  },
                  beginAtZero: false,
                  grid: {
                    color: "#fff",
                    drawBorder: false,
                  },
                  suggestedMin: 50,
                  suggestedMax: 100,
                },
                xAxes: {
                  grid: {
                    color: "#fff",
                  },
                },
              },
            }}
            data={{
              labels: average24HourLabel,
              datasets: [
                {
                  label: "Sound level",
                  data: average24Hour,
                  borderColor: "#4f46e5",
                  borderWidth: 3,
                  backgroundColor: "#818cf8",
                },
              ],
            }}
          ></Line>
        </div>
        <div className="flex flex-col items-center justify-center mt-8">
          <span className="font-thin text-3xl">
            {data.totalSamplesCount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
          <span className="text text-indigo-700">total samples</span>
        </div>
        <div className="flex justify-center mt-8">
          <div className="flex flex-col items-center justify-center w-1/2">
            <span className="font-thin text-2xl">
              {data.totalSamplesCountLastHour
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            <span className="text-sm text-indigo-700">samples last hour</span>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2">
            <span className="font-thin text-2xl">
              {data.totalSamplesCountToday
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            <span className="text-sm text-indigo-700">samples today</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4 px-2 pt-2 border-t-2">
        <span className="flex items-center text-xs text-gray-500">
          <span className="mt-0.5">
            Updated {lastPingDuration.humanize()} ago
          </span>
        </span>
        <span className="flex items-center text-xs text-gray-500">
          {online ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          )}

          <span className="mt-0.5">
            {online ? `${data.device.ping.latency}s` : `Offline`}
          </span>
        </span>
      </div>
    </div>
  );
}
