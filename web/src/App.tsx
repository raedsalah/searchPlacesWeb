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
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user's geolocation on app start
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // setDefaultLocation({
          //   lat: position.coords.latitude,
          //   lng: position.coords.longitude,
          // });
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const location = selectedPlace
    ? {
        lat: selectedPlace.geometry!.lat,
        lng: selectedPlace.geometry!.lng,
      }
    : { lat: 40.7128, lng: -74.006 };

  if (loading) {
    return (
      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Loading map...
        </Typography>
      </Container>
    );
  }

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
