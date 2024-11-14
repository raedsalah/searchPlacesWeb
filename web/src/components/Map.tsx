import React, { useContext, useEffect, useRef } from "react";
import { GoogleMapsContext } from "../contexts/GoogleMapsLoader";

interface MapProps {
  location: google.maps.LatLngLiteral;
}

const Map: React.FC<MapProps> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const isLoaded = useContext(GoogleMapsContext);

  useEffect(() => {
    if (!isLoaded) return;

    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 2,
      });

      markerRef.current = new window.google.maps.Marker({
        position: location,
        map: mapInstanceRef.current,
      });
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(location);
      mapInstanceRef.current.setZoom(15); // TODO make it dynamic?

      if (markerRef.current) {
        markerRef.current.setPosition(location);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: location,
          map: mapInstanceRef.current,
        });
      }
    }
  }, [isLoaded, location]);

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
};

export default Map;
