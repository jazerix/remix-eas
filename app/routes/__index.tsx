import AudioMap from "~/components/audioMap";

import SoundWindow from "~/components/soundWindow";
import { useState } from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import MongoWrapper from "~/modules/mongodb.server";

type LoaderData = {
  apiKey: string;
  mongo: [
    {
      device: string;
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
  const [showSoundWindow, setShowSoundWindow] = useState<null | number>(null);
  const data = useLoaderData<LoaderData>();
  console.log(data);

  return (
    <>
      <div className="relative">
        {showSoundWindow != null && (
          <SoundWindow close={() => setShowSoundWindow(null)} />
        )}
        <Outlet />
        <div className="relative">
          <AudioMap
            markers={data.mongo.map((device) => {
              return {
                lat: device.location.lat,
                lng: device.location.lng,
                action: () => setShowSoundWindow(1),
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
