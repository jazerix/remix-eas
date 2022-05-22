import type { GoogleMapProps } from "react-google-maps";
import { Marker } from "react-google-maps";
import { GoogleMap } from "react-google-maps";
import withGoogleMap from "react-google-maps/lib/withGoogleMap";
import withScriptjs from "react-google-maps/lib/withScriptjs";

interface Props extends GoogleMapProps {
  markers: MarkerInterface[];
}

interface MarkerInterface {
  lat: number;
  lng: number;
  action: () => void;
}

const maps = withScriptjs(
  withGoogleMap((props: Props) => (
    <GoogleMap
      options={{
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }}
      defaultZoom={7}
      defaultCenter={{ lat: 56.093, lng: 10.615 }}
    >
      {props.markers.map((m, i) => (
        <Marker
          icon={{
            url: "/volume-full.svg",
            fillColor: "#00ffff",
            strokeColor: "#000",
            strokeWeight: 2,
            fillOpacity: 1,
          }}
          key={i}
          onClick={m.action}
          clickable={true}
          position={{ lat: m.lat, lng: m.lng }}
        />
      ))}
    </GoogleMap>
  ))
);

export default maps;
