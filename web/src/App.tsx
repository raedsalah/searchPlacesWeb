import React, { useEffect, useState } from "react";
import PlaceAutocomplete from "./components/PlaceAutocomplete";
import SearchHistory from "./components/SearchHistory";
import Map from "./components/Map";
import { CircularProgress, Container, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import GoogleMapsLoader from "./contexts/GoogleMapsLoader";

const App: React.FC = () => {
  const { selectedPlace, favorites, history } = useSelector(
    (state: RootState) => state.search
  );

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
