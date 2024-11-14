import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  Typography,
} from "@mui/material";
import { Star, DeleteForever } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  Place,
  removeAllFavorite,
  removeFavorite,
  selectPlace,
} from "../store/slice/searchesSlice";

const FavoritesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.search.favorites);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleUnfavorite = async (placeId: string) => {
    try {
      const resultAction = await dispatch(removeFavorite(placeId));
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
  };

  const handleSelectPlace = (place: Place) => {
    dispatch(selectPlace(place));
  };
  const handleClearFavorites = () => {
    dispatch(removeAllFavorite());
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
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h5">Favorites</Typography>
        <div
          className="p-2 flex flex-row gap-1 justify-center items-center cursor-pointer"
          onClick={handleClearFavorites}
        >
          <p className="text-red-500 cursor-pointer">Clear Favorite</p>{" "}
          <DeleteForever fontSize="small" className="text-red-500" />
        </div>
      </div>
      <List className="flex flex-col gap-2">
        {favorites.map((place, index) => {
          if (!place.place_id) return null;
          return (
            <ListItem
              className="bg-slate-100 rounded-md shadow-md cursor-pointer"
              key={place.place_id || index}
              onClick={() => handleSelectPlace(place)}
              secondaryAction={
                <Tooltip title="Remove from Favorites">
                  <IconButton
                    edge="end"
                    aria-label="remove-favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnfavorite(place.place_id!);
                    }}
                  >
                    <Star sx={{ color: "gold" }} />
                  </IconButton>
                </Tooltip>
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

export default FavoritesList;
