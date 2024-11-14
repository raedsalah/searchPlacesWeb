import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { AppDispatch, RootState } from "../store";
import { addFavorite, Place, selectPlace } from "../store/slice/searchesSlice";
import { StarBorder, Star } from "@mui/icons-material";

const SearchHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const history = useSelector((state: RootState) => state.search.history);
  const favorites = useSelector((state: RootState) => state.search.favorites);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleFavorite = async (placeId: string) => {
    try {
      const resultAction = await dispatch(addFavorite(placeId));
      if (addFavorite.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: "Favorite added successfully!",
          severity: "success",
        });
      } else {
        throw new Error(resultAction.payload || "Failed to add favorite.");
      }
    } catch (error: any) {
      console.error("Error adding favorite:", error);
      setSnackbar({
        open: true,
        message: "Error adding favorite.",
        severity: "error",
      });
    }
  };

  const handleSelectPlace = (place: Place) => {
    dispatch(selectPlace(place));
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <List>
        {history.map((place, index) => {
          const isFavorited = place.place_id
            ? favorites.includes(place.place_id)
            : false;
          return (
            <ListItem
              key={place.place_id || index}
              onClick={() => handleSelectPlace(place)}
              secondaryAction={
                place.place_id ? (
                  <IconButton
                    edge="end"
                    aria-label="favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(place.place_id!);
                    }}
                  >
                    {isFavorited ? (
                      <Star sx={{ color: "gold" }} />
                    ) : (
                      <StarBorder />
                    )}
                  </IconButton>
                ) : null
              }
            >
              <ListItemText primary={place.name || "Unnamed Place"} />
            </ListItem>
          );
        })}
      </List>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SearchHistory;
