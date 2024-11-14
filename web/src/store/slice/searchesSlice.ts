import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Place {
  name?: string;
  place_id?: string;
  geometry?: google.maps.places.PlaceGeometry;
  [key: string]: any;
}

const searchesSlice = createSlice({
  name: "searches",
  initialState: [] as Place[],
  reducers: {
    addSearch: (state, action: PayloadAction<Place>) => {
      state.push(action.payload);
    },
  },
});

export const { addSearch } = searchesSlice.actions;
export default searchesSlice.reducer;
