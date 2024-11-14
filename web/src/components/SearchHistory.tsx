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
import {
  addFavorite,
  Place,
  removeFavorite,
  selectPlace,
} from "../store/slice/searchesSlice";
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

  const handleToggleFavorite = async (place: Place) => {
    if (!place.place_id) return;

    const isFavorited = favorites.some(
      (fav) => fav.place_id === place.place_id
    );

    if (isFavorited) {
      try {
        const resultAction = await dispatch(removeFavorite(place.place_id));
        if (removeFavorite.fulfilled.match(resultAction)) {
          setSnackbar({
            open: true,
            message: "Favorite removed successfully!",
            severity: "success",
          });
        } else {
          throw new Error(resultAction.payload || "Failed to remove favorite.");
        }
      } catch (error: any) {
        console.error("Error removing favorite:", error);
        setSnackbar({
          open: true,
          message: "Error removing favorite.",
          severity: "error",
        });
      }
    } else {
      try {
        const resultAction = await dispatch(addFavorite(place));
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
          if (!place.place_id) return null; // skip if no id, migrating from old structure
          const isFavorited = favorites.some(
            (fav) => fav.place_id === place.place_id
          );
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
                      handleToggleFavorite(place);
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
