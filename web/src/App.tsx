import React, { useEffect } from "react";
import PlaceAutocomplete from "./components/PlaceAutocomplete";
import SearchHistory from "./components/SearchHistory";
import Map from "./components/Map";
import { Container, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import GoogleMapsLoader from "./contexts/GoogleMapsLoader";
import { fetchHistory, fetchFavorites } from "./store/slice/searchesSlice";

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
      <Container>
        <Typography variant="h4" gutterBottom>
          Google Places Autocomplete
        </Typography>
        <PlaceAutocomplete />
        <SearchHistory />
        {location && <Map location={location} />}
      </Container>
    </GoogleMapsLoader>
  );
};

export default App;
