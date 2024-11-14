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
  favorites: string[];
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
  string,
  string,
  { rejectValue: string }
>("places/addFavorite", async (placeId, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to add favorite.");
    }

    return placeId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add favorite.");
  }
});

const MAX_HISTORY_LENGTH = 5;

const searchSlice = createSlice({
  name: "search",
  initialState: initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<Place>) => {
      if (state.history.length > MAX_HISTORY_LENGTH) {
        state.history.pop();
      }
      state.history.unshift(action.payload);
      state.selectedPlace = action.payload;
    },
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
      .addCase(
        addFavorite.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.favorites.push(action.payload);
        }
      )
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add favorite.";
      });
  },
});

export const { addSearch, selectPlace } = searchSlice.actions;
export default searchSlice.reducer;
export const selectFavorites = (state: RootState) => state.search.favorites;
