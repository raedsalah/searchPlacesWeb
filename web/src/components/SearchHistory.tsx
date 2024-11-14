import React from "react";
import { useSelector } from "react-redux";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import { RootState } from "../store";

const SearchHistory: React.FC = () => {
  const searches = useSelector((state: RootState) => state.searches);

  const handleFavorite = async (placeId: string) => {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId }),
    });
  };

  return (
    <List>
      {searches.map((place, index) => (
        <ListItem
          key={index}
          secondaryAction={
            place.place_id ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleFavorite(place.place_id!)}
              >
                {"Favorite"}
              </Button>
            ) : null
          }
        >
          <ListItemText primary={place.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default SearchHistory;
