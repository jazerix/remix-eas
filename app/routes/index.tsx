import AudioMap from "~/components/audioMap";

import SoundWindow from "~/components/soundWindow";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import MongoWrapper from "~/modules/mongodb.server";

type LoaderData = {
  device: string;
  location: {
    lng: number;
    lat: number;
  };
}[];

export const loader: LoaderFunction = async () => {
  const data = await MongoWrapper.devices().find().toArray();

  return json(data);
};

export default function Index() {
  const [showSoundWindow, setShowSoundWindow] = useState<null | number>(null);
  const devices = useLoaderData<LoaderData>();

  return (
    <>
      <div className="relative">
        {showSoundWindow != null && (
          <SoundWindow close={() => setShowSoundWindow(null)} />
        )}
        <div className="relative">
          <AudioMap
            markers={devices.map((device) => {
              return {
                lat: device.location.lat,
                lng: device.location.lng,
                action: () => setShowSoundWindow(1),
              };
            })}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD2h781HrZK2Y5-Tnm9Y11Mjd9BuTqtM2c&v=3.exp"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `calc(100vh - 52px)` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    </>
  );
}
