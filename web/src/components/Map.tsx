import React, { useEffect, useRef } from "react";

interface MapProps {
  location: google.maps.LatLngLiteral;
}

const Map: React.FC<MapProps> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
      });
      new window.google.maps.Marker({
        position: location,
        map,
      });
    }
  }, [location]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};

export default Map;
