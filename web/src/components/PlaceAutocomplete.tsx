import React, { useContext, useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { addSearch } from "../store/slice/searchesSlice";
import { AppDispatch } from "../store";
import { GoogleMapsContext } from "../contexts/GoogleMapsLoader";

const PlaceAutocomplete: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isLoaded = useContext(GoogleMapsContext);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  console.log(API_KEY);

  useEffect(() => {
    if (!isLoaded) return;

    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "my" },
        }
      );
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
    }
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      const placeData = {
        name: place.name,
        place_id: place.place_id,
        geometry: {
          lat: place.geometry!.location!.lat(),
          lng: place.geometry!.location!.lng(),
        },
      };

      dispatch(addSearch(placeData));
    }
  };

  if (!isLoaded) {
    return <div>Loading Autocomplete...</div>; // TODO design in better?
  }

  return (
    <TextField
      inputRef={inputRef}
      label="Search Places"
      variant="outlined"
      fullWidth
    />
  );
};

export default PlaceAutocomplete;
