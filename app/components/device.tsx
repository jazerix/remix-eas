import { useFetcher } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  name: string;
  lat: number;
  lng: number;
  sampleCount: number;
  apiKey: string;
};

export default function Device(props: Props) {
  const [address, setAddress] = useState<null | string>(null);
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${props.lat},${props.lng}&key=${props.apiKey}`
  ).then((x) =>
    x.json().then((j) => {
      setAddress(j.results[0].formatted_address);
    })
  );

  //const timer = setInterval(() => console.log("hello"), 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("This will be called every 2 seconds");
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const online = false;
  return (
    <Link
      to="/"
      className="relative px-4 bg-white py-4 rounded-md border-2 border-gray-400 hover:shadow-md cursor-pointer flex items-center mb-5"
    >
      {online ? (
        <div className="flex h-4 w-4 -mt-0.5 absolute -top-1 -left-2">
          <span className="animate-ping absolute inline-flex w-4 h-4 rounded-full bg-green-400"></span>
          <span className="relative inline-flex w-4 h-4 rounded-full bg-green-400"></span>
        </div>
      ) : (
        <div className="flex h-4 w-4 -mt-0.5 absolute -top-1 -left-2">
          <span className="relative inline-flex w-4 h-4 rounded-full bg-red-400"></span>
        </div>
      )}
      <div className="flex w-2/12 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mr-2 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-lg">{props.name}</span>
      </div>
      <div className="flex flex-col text-gray-500 w-2/12">
        <span>
          Lat: <span className="font-thin">{props.lat}</span>
        </span>
        <span>
          Long: <span className="font-thin">{props.lng}</span>
        </span>
      </div>
      <div className="w-3/12">{address}</div>
      {online ? (
        <div className="flex flex-col w-2/12">
          <span>Online</span>
          <span className="text-sm -mt-2 font-thin text-indigo-600">
            Last ping 12s ago
          </span>
        </div>
      ) : (
        <div className="flex flex-col w-2/12">
          <span>Offline</span>
          <span className="text-sm -mt-2 font-thin text-indigo-600">
            Last seen 4 days ago
          </span>
        </div>
      )}
      <div className="flex flex-col w-1/12">
        <span className="text-lg font-">{props.sampleCount}</span>
        <span className="text-sm -mt-2 font-thin text-indigo-600">Samples</span>
      </div>
    </Link>
  );
}
