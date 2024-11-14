import React, { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { addSearch } from "../store/slice/searchesSlice";
import { AppDispatch } from "../store";

const PlaceAutocomplete: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  console.log(API_KEY);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initializeAutocomplete;
      document.body.appendChild(script);
    };

    const initializeAutocomplete = () => {
      if (inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current
        );
        autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
      }
    };

    const handlePlaceSelect = () => {
      if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        dispatch(addSearch(place));
      }
    };

    loadScript();
  }, [dispatch]);

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
