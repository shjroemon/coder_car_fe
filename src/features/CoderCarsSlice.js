import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../app/apiService";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { sliderClasses } from "@mui/material";

export const getCars = createAsyncThunk("car/getCars", async () => {
  try {
    let url = `/car`;

    const response = await apiService.get(url);
    const timeout = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("ok");
        }, 1000);
      });
    };
    await timeout();

    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// export const getPokemonById = createAsyncThunk(
//   "pokemons/getPokemonById",
//   async (id, { rejectWithValue }, dispatch) => {
//     try {
//       let url = `/pokemons/${id}`;
//       const response = await apiService.get(url);
//       if (!response) return rejectWithValue({ message: "No data" });

//       return response;
//     } catch (error) {
//       toast.error(error.message);
//       return rejectWithValue(error);
//     }
//   }
// );

export const addPokemon = createAsyncThunk(
  "car/addCar",
  async ({ name, id, imgUrl, types }, { rejectWithValue }) => {
    try {
      let url = "/pokemons";

      await apiService.post(url, { name, id, url: imgUrl, types });
      toast.success("Created Pokemon");
      return;
    } catch (error) {
      toast.error(error.message);

      return rejectWithValue(error);
    }
  }
);

export const editPokemon = createAsyncThunk(
  "pokemons/editPokemon",
  async ({ name, id, url, types }, { rejectWithValue }) => {
    try {
      let url = `/pokemons/${id}`;
      await apiService.put(url, { name, url, types });
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePokemon = createAsyncThunk(
  "pokemons/deletePokemon",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      let url = `/pokemons/${id}`;
      await apiService.delete(url);
      dispatch(getPokemonById());
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const pokemonSlice = createSlice({
  name: "pokemons",
  initialState: {
    isLoading: false,
    pokemons: [],
    pokemon: {
      pokemon: null,
      nextPokemon: null,
      previousPokemon: null,
    },
    search: "",
    type: "",
    page: 1,
  },
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    changePage: (state, action) => {
      if (action.payload) {
        state.page = action.payload;
      } else {
        state.page++;
      }
    },
    typeQuery: (state, action) => {
      state.type = action.payload;
      getPokemons(state.type);
    },
    searchQuery: (state, action) => {
      state.search = action.payload;
      getPokemons(state.page, state.search);
    },
  },
  extraReducers: {
    [getPokemons.pending]: (state, action) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [getPokemonById.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },

    [addPokemon.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [deletePokemon.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [editPokemon.pending]: (state) => {
      state.loading = true;
      state.errorMessage = "";
    },
    [getPokemons.fulfilled]: (state, action) => {
      state.loading = false;
      const { search, type } = state;
      if ((search || type) && state.page === 1) {
        state.pokemons = action.payload;
      } else {
        state.pokemons = [...state.pokemons, ...action.payload];
      }
    },
    [getPokemonById.fulfilled]: (state, action) => {
      state.loading = false;
      state.pokemon = action.payload;
    },
    [addPokemon.fulfilled]: (state) => {
      state.loading = false;
    },
    [deletePokemon.fulfilled]: (state) => {
      state.loading = false;
    },
    [editPokemon.fulfilled]: (state) => {
      state.loading = true;
    },
    [getPokemons.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [getPokemonById.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },

    [addPokemon.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [deletePokemon.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [editPokemon.rejected]: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
  },
});

const { actions, reducer } = pokemonSlice;
export const { changePage, searchQuery, typeQuery } = actions;
export default reducer;
