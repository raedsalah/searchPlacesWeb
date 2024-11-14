import React, { useEffect } from "react";
import PlaceAutocomplete from "./components/PlaceAutocomplete";
import Map from "./components/Map";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import GoogleMapsLoader from "./contexts/GoogleMapsLoader";
import { fetchHistory, fetchFavorites } from "./store/slice/searchesSlice";
import FavoritesList from "./components/FavoritesList";
import "./styles/app.css";

const App: React.FC = () => {
  const { selectedPlace } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchHistory());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const location = selectedPlace
    ? {
        lat: selectedPlace.geometry!.lat,
        lng: selectedPlace.geometry!.lng,
      }
    : { lat: 3.139, lng: 101.6869 };

  return (
    <GoogleMapsLoader>
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="p-4 md:p-8 flex-1">
          <Typography variant="h4" gutterBottom>
            Google Places Autocomplete
          </Typography>
          <PlaceAutocomplete />
          <FavoritesList />
        </div>

        <div className="flex-1">
          <div className="map-container h-[50vh] md:h-screen ">
            <Map location={location} />
          </div>
        </div>
      </div>
    </GoogleMapsLoader>
  );
};

export default App;
