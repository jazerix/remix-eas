import AudioMap from "~/components/audioMap";

import { useState } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import MongoWrapper from "~/modules/mongodb.server";

type LoaderData = {
  apiKey: string;
  mongo: [
    {
      name: string;
      location: {
        lng: number;
        lat: number;
      };
    }
  ];
};

export const loader: LoaderFunction = async () => {
  const mongo = await MongoWrapper.devices().find().toArray();
  return json({
    apiKey: process.env.GOOGLE_MAPS_API,
    mongo,
  });
};

export const apiKeyLoader: LoaderFunction = async () => {
  return json<ApiKey>({
    key: process.env.GOOGLE_MAPS_API as string,
  });
};

type ApiKey = {
  key: string;
};

export default function Layout() {
  const data = useLoaderData<LoaderData>();
  let [searchParams, setSearchParams] = useSearchParams();

  let navigate = useNavigate();

  let center = searchParams.has("lat")
    ? {
        lat: Number(searchParams.get("lat")),
        lng: Number(searchParams.get("lng")) - 0.05,
      }
    : { lat: 55.401728, lng: 10.381953 };

  return (
    <>
      <div className="relative">
        <Outlet />
        <div className="relative">
          <AudioMap
            center={center}
            zoomLevel={searchParams.has("lat") ? 13 : 12}
            markers={data.mongo.map((device) => {
              return {
                lat: device.location.lat,
                lng: device.location.lng,
                action: () => navigate(`/devices/${device.name}`),
              };
            })}
            googleMapURL={
              "https://maps.googleapis.com/maps/api/js?key=" +
              data.apiKey +
              "&v=3.exp"
            }
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `calc(100vh - 52px)` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    </>
  );
}
