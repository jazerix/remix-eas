import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import DeviceListItem from "~/components/deviceListItem";
import MongoWrapper from "~/modules/mongodb.server";

type Props = {};

type LoaderData = {
  apiKey: string;
  devices: {
    _id: string;
    name: string;
    location: {
      lat: number;
      lng: number;
    };
    sampleCount: number;
    ping: {
      latency: number | null;
      last: Date;
    };
    last:
      | undefined
      | {
          collected_at: string;
          data: number[];
          device: string;
          sampled_at: string;
          _id: string;
        };
  }[];
};

export const loader: LoaderFunction = async () => {
  const devices = await MongoWrapper.devices()
    .aggregate([
      {
        $lookup: {
          from: "samples",
          localField: "name",
          foreignField: "device",
          as: "samples",
        },
      },
      {
        $project: {
          name: "$name",
          ping: "$ping",
          location: "$location",
          sampleCount: {
            $size: "$samples",
          },
          last: {
            $last: "$samples",
          },
        },
      },
    ])
    .toArray();

  console.log(devices);
  return json({
    devices,
    apiKey: process.env.GOOGLE_MAPS_API,
  });
};

export default function Devices(props: Props) {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <div className="container mx-auto mt-10">
        <h1 className="font-thin text-3xl">Devices on Network</h1>
        <div>
          <div className="flex items-center mt-4 mb-2"></div>
          {data.devices.map((device) => (
            <DeviceListItem
              apiKey={data.apiKey}
              lastPing={device.ping.last}
              name={device.name}
              lat={device.location.lat}
              lng={device.location.lng}
              key={device._id}
              sampleCount={device.sampleCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
