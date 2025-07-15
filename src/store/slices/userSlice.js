// my book slice
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    message: null,
    users: [],
  },

  reducers: {
    getUsersRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    getUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload.users;
    },

    getUsersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateUserSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updateUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const getUsers = () => async (dispatch) => {
  dispatch(userSlice.actions.getUsersRequest());

  await axios
    .get(`${import.meta.env.VITE_SERVER}/api/v1/user/all`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(userSlice.actions.getUsersSuccess(res.data));
    })
    .catch((err) => {
      dispatch(userSlice.actions.getUsersFailure(err.response.data.message));
    });
};

export const updateUser = (id, updatedData) => async (dispatch) => {
  // console.log(id, updatedData);
  dispatch(userSlice.actions.updateUserRequest());

  await axios
    .put(
      `${import.meta.env.VITE_SERVER}/api/v1/user/update/${id}`,
      updatedData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(userSlice.actions.updateUserSuccess(res.data));
    })
    .catch((err) => {
      dispatch(userSlice.actions.updateUserFailure(err.response.data.message));
    });
};

export default userSlice.reducer;
