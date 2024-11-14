import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface Place {
  name?: string;
  place_id?: string;
  geometry?: {
    lat: number;
    lng: number;
  };
  [key: string]: any;
}

interface SearchState {
  history: Place[];
  selectedPlace: Place | null;
  favorites: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  history: [], //
  selectedPlace: null,
  favorites: [],
  loading: false,
  error: null,
};

// thunks
export const addFavorite = createAsyncThunk<
  Place,
  Place,
  { rejectValue: string }
>("search/addFavorite", async (place, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placeId: place.place_id,
        name: place.name,
        latitude: place.geometry?.lat,
        longitude: place.geometry?.lng,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to add favorite.");
    }

    return place;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add favorite.");
  }
});

export const removeFavorite = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("search/removeFavorite", async (placeId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/favorites/${placeId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to remove favorite.");
    }

    return placeId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to remove favorite.");
  }
});
export const removeAllFavorite = createAsyncThunk<
  Place[],
  void,
  { rejectValue: string }
>("search/removeAllFavorite", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/favorites/all`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to remove all favorite."
      );
    }

    return [];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to remove favorite.");
  }
});

export const fetchHistory = createAsyncThunk<
  Place[],
  void,
  { rejectValue: string }
>("search/fetchHistory", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/search");

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch history.");
    }

    const data = await response.json();
    const places: Place[] = data.map((item: any) => ({
      name: item.Name,
      place_id: item.PlaceId,
      geometry: {
        lat: parseFloat(item.Latitude),
        lng: parseFloat(item.Longitude),
      },
    }));

    return places;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch history.");
  }
});

export const fetchFavorites = createAsyncThunk<
  Place[],
  void,
  { rejectValue: string }
>("search/fetchFavorites", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/favorites");

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch favorites.");
    }

    const data = await response.json();

    const favoritePlaces: Place[] = data.map((item: any) => ({
      name: item.Name,
      place_id: item.PlaceId,
      geometry: {
        lat: parseFloat(item.Latitude),
        lng: parseFloat(item.Longitude),
      },
    }));

    return favoritePlaces;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch favorites.");
  }
});

export const addSearch = createAsyncThunk<
  Place,
  Place,
  { rejectValue: string }
>("search/addSearch", async (place, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placeId: place.place_id,
        name: place.name,
        latitude: place.geometry?.lat,
        longitude: place.geometry?.lng,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to add search.");
    }

    return place;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add search.");
  }
});

const MAX_HISTORY_LENGTH = 5;

const searchSlice = createSlice({
  name: "search",
  initialState: initialState,
  reducers: {
    selectPlace: (state, action: PayloadAction<Place>) => {
      state.selectedPlace = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action: PayloadAction<Place>) => {
        state.loading = false;
        if (
          !state.favorites.find(
            (fav) => fav.place_id === action.payload.place_id
          )
        ) {
          state.favorites.push(action.payload);
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add favorite.";
      })
      // remove fav
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFavorite.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.favorites = state.favorites.filter(
            (fav) => fav.place_id !== action.payload
          );
        }
      )
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove favorite.";
      })
      // remove all fav
      .addCase(removeAllFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAllFavorite.fulfilled, (state) => {
        state.loading = false;
        state.favorites = [];
      })
      .addCase(removeAllFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove favorite.";
      })
      // fetch fav
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<Place[]>) => {
          state.loading = false;
          state.favorites = action.payload;
        }
      )
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch favorites.";
      })
      // fetch history
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHistory.fulfilled,
        (state, action: PayloadAction<Place[]>) => {
          state.loading = false;
          state.history = action.payload;
        }
      )
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch history.";
      })
      // add history
      .addCase(addSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSearch.fulfilled, (state, action: PayloadAction<Place>) => {
        state.loading = false;
        if (state.history.length >= MAX_HISTORY_LENGTH) {
          state.history.pop();
        }
        state.history.unshift(action.payload);
        state.selectedPlace = action.payload;
      })
      .addCase(addSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add search.";
      });
  },
});

export const { selectPlace } = searchSlice.actions;
export default searchSlice.reducer;
export const selectFavorites = (state: RootState) => state.search.favorites;
