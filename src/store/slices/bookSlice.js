// my book slice
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },

  reducers: {
    getBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload.books;
    },
    getBooksFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBooksSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBooksFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updateBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updateBookFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    deleteBookFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const getBooks = () => async (dispatch) => {
  // console.log("under to hai");
  dispatch(bookSlice.actions.getBooksRequest());

  await axios
    .get(`${import.meta.env.VITE_SERVER}/api/v1/book/all`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(bookSlice.actions.getBooksSuccess(res.data));
    })
    .catch((err) => {
      dispatch(bookSlice.actions.getBooksFailure(err.response.data.message));
    });
};

export const addBook = (data) => async (dispatch) => {
  // console.log("data from slice: ", data);

  dispatch(bookSlice.actions.addBooksRequest());
  await axios
    .post(`${import.meta.env.VITE_SERVER}/api/v1/book/admin/add`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      // console.log("res from server at slice: ", res);
      dispatch(bookSlice.actions.addBooksSuccess(res.data));
    })
    .catch((err) => {
      dispatch(bookSlice.actions.addBooksFailure(err.response.data.message));
    });
};

export const updateBook = (data) => async (dispatch) => {
  // console.log("data in client", data);

  const id = data._id;

  const updatedData = {
    title: data.title,
    author: data.author,
    isbn: data.isbn,
    category: data.category,
    publishYear: data.publishYear,
    totalCopies: data.totalCopies,
    availableCopies: data.availableCopies,
    description: data.description,
    coverImage: data.coverImage,
    price: data.price,
  };

  dispatch(bookSlice.actions.updateBookRequest());

  await axios
    .put(
      `${import.meta.env.VITE_SERVER}/api/v1/book/admin/update/${id}`,
      updatedData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(bookSlice.actions.updateBookSuccess(res.data));
    })
    .catch((err) => {
      dispatch(bookSlice.actions.updateBookFailure(err.response.data.message));
    });
};

export const deleteBook = (id) => async (dispatch) => {
  dispatch(bookSlice.actions.deleteBookRequest());

  await axios
    .delete(`${import.meta.env.VITE_SERVER}/api/v1/book/admin/delete/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(bookSlice.actions.deleteBookSuccess(res.data));
    })
    .catch((err) => {
      dispatch(bookSlice.actions.deleteBookFailure(err.response.data.message));
    });
};

export default bookSlice.reducer;
