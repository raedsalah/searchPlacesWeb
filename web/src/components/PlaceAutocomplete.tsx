import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  ListItemIcon,
  ListSubheader,
} from "@mui/material";
import { Star, StarBorder, AccessTime } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addSearch,
  addFavorite,
  removeFavorite,
} from "../store/slice/searchesSlice";
import { GoogleMapsContext } from "../contexts/GoogleMapsLoader";
import { debounce } from "lodash";

const PlaceAutocomplete: React.FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.search.favorites);
  const history = useAppSelector((state) => state.search.history);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const isLoaded = useContext(GoogleMapsContext);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    autocompleteServiceRef.current =
      new window.google.maps.places.AutocompleteService();
    if (inputRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  }, [isLoaded]);

  const prioritizeResults = useCallback(
    (predictions: google.maps.places.AutocompletePrediction[]) => {
      const favoritePlaceIds = new Set(favorites.map((fav) => fav.place_id));
      const historyPlaceIds = new Set(history.map((item) => item.place_id));

      const favoritePredictions: google.maps.places.AutocompletePrediction[] =
        [];
      const historyPredictions: google.maps.places.AutocompletePrediction[] =
        [];
      const otherPredictions: google.maps.places.AutocompletePrediction[] = [];

      predictions.forEach((prediction) => {
        if (favoritePlaceIds.has(prediction.place_id)) {
          favoritePredictions.push(prediction);
        } else if (historyPlaceIds.has(prediction.place_id)) {
          historyPredictions.push(prediction);
        } else {
          otherPredictions.push(prediction);
        }
      });

      return [
        ...favoritePredictions,
        ...historyPredictions,
        ...otherPredictions,
      ];
    },
    [favorites, history]
  );

  const debouncedFetchPredictions = useRef(
    debounce((input: string) => {
      if (!autocompleteServiceRef.current) return;

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "my" },
        },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            let limitedPredictions = predictions.slice(0, 8);
            limitedPredictions = prioritizeResults(limitedPredictions);
            setPredictions(limitedPredictions);
          } else {
            setPredictions([]);
          }
        }
      );
    }, 300)
  ).current;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    if (!input) {
      setPredictions([]);
      return;
    }

    debouncedFetchPredictions(input);
  };

  const handlePredictionSelect = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    if (!prediction.place_id || !placesServiceRef.current) return;

    placesServiceRef.current.getDetails(
      { placeId: prediction.place_id },
      (placeResult, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          placeResult
        ) {
          const placeData = {
            name: placeResult.name,
            place_id: placeResult.place_id,
            geometry: {
              lat: placeResult.geometry!.location!.lat(),
              lng: placeResult.geometry!.location!.lng(),
            },
          };

          dispatch(addSearch(placeData));

          setPredictions([]);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }
      }
    );
  };

  const handleToggleFavorite = async (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    if (!prediction.place_id) return;

    const isFavorited = favorites.some(
      (fav) => fav.place_id === prediction.place_id
    );

    if (isFavorited) {
      dispatch(removeFavorite(prediction.place_id));
    } else {
      if (!placesServiceRef.current) return;

      placesServiceRef.current.getDetails(
        { placeId: prediction.place_id },
        (placeResult, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            placeResult
          ) {
            const placeData = {
              name: placeResult.name,
              place_id: placeResult.place_id,
              geometry: {
                lat: placeResult.geometry!.location!.lat(),
                lng: placeResult.geometry!.location!.lng(),
              },
            };
            dispatch(addFavorite(placeData));
          }
        }
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setPredictions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [predictions]);

  if (!isLoaded) {
    return <div>Loading Autocomplete...</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      <TextField
        inputRef={inputRef}
        label="Search Places"
        variant="outlined"
        fullWidth
        onChange={handleInputChange}
      />
      {predictions.length > 0 && (
        <Paper
          ref={dropdownRef}
          style={{
            position: "absolute",
            zIndex: 1,
            top: "100%",
            left: 0,
            right: 0,
          }}
        >
          <List>
            {predictions.map((prediction, index) => {
              const isFavorited = favorites.some(
                (fav) => fav.place_id === prediction.place_id
              );
              const isInHistory = history.some(
                (item) => item.place_id === prediction.place_id
              );

              let sectionLabel = null;
              if (index === 0) {
                if (isFavorited) {
                  sectionLabel = "";
                } else if (isInHistory) {
                  sectionLabel = "";
                } else {
                  sectionLabel = "Suggestions";
                }
              } else {
                const prevPrediction = predictions[index - 1];
                const wasPrevFavorited = favorites.some(
                  (fav) => fav.place_id === prevPrediction.place_id
                );
                const wasPrevInHistory = history.some(
                  (item) => item.place_id === prevPrediction.place_id
                );

                if (isFavorited && !wasPrevFavorited) {
                  sectionLabel = "";
                } else if (isInHistory && !wasPrevInHistory && !isFavorited) {
                  sectionLabel = "";
                } else if (
                  !isFavorited &&
                  !isInHistory &&
                  (wasPrevFavorited || wasPrevInHistory)
                ) {
                  sectionLabel = "Suggestions";
                }
              }

              return (
                <React.Fragment key={prediction.place_id}>
                  {sectionLabel && (
                    <ListSubheader style={{ backgroundColor: "#fff" }}>
                      {sectionLabel}
                    </ListSubheader>
                  )}
                  <ListItem
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePredictionSelect(prediction);
                    }}
                  >
                    <ListItemIcon>
                      {isFavorited ? (
                        <IconButton
                          edge="start"
                          aria-label="toggle-favorite"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(prediction);
                          }}
                        >
                          <Star sx={{ color: "gold" }} />
                        </IconButton>
                      ) : isInHistory ? (
                        <AccessTime />
                      ) : (
                        <IconButton
                          edge="start"
                          aria-label="toggle-favorite"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(prediction);
                          }}
                        >
                          <StarBorder />
                        </IconButton>
                      )}
                    </ListItemIcon>
                    <ListItemText primary={prediction.description} />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default PlaceAutocomplete;
