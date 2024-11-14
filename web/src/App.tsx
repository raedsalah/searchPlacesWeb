import React from "react";
import PlaceAutocomplete from "./components/PlaceAutocomplete";
import SearchHistory from "./components/SearchHistory";
import Map from "./components/Map";
import { Container, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const App: React.FC = () => {
  const { selectedPlace, favorites, history } = useSelector(
    (state: RootState) => state.search
  );

  const location = selectedPlace
    ? {
        lat: selectedPlace.geometry!.lat,
        lng: selectedPlace.geometry!.lng,
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
