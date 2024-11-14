import React from "react";
import PlaceAutocomplete from "./components/PlaceAutocomplete";
import SearchHistory from "./components/SearchHistory";
import Map from "./components/Map";
import { Container, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const App: React.FC = () => {
  const selectedPlace = useSelector((state: RootState) =>
    state.searches.length > 0 ? state.searches[state.searches.length - 1] : null
  );

  const location = selectedPlace?.geometry?.location
    ? {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      }
    : null;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Google Places Autocomplete
      </Typography>
      <PlaceAutocomplete />
      <SearchHistory />
      {location && <Map location={location} />}
    </Container>
  );
};

export default App;
