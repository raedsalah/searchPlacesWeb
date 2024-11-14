import React, {
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { selectPlace } from "../store/slice/searchesSlice";

interface GoogleMapsLoaderProps {
  children: ReactNode;
}

export const GoogleMapsContext = React.createContext<boolean>(false);

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (
      typeof window.google === "object" &&
      typeof window.google.maps === "object"
    ) {
      resolve();
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => reject());
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
};

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const API_KEY = useMemo(() => import.meta.env.VITE_GOOGLE_MAPS_API_KEY, []);

  const handleGeolocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            selectPlace({
              name: "You",
              geometry: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            })
          );
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    }
  }, [dispatch]);

  useEffect(() => {
    loadGoogleMapsScript(API_KEY)
      .then(() => {
        setIsLoaded(true);
        handleGeolocation();
      })
      .catch((error) => {
        console.error("Error loading Google Maps script:", error);
      });
  }, [API_KEY, handleGeolocation]);

  return (
    <GoogleMapsContext.Provider value={isLoaded}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsLoader;
