import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    message: null,
    borrowRecords: [],
    myBorrowRecords: [],
    isAuthenticated: false,
  },
  reducers: {
    borrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    borrowedBooksSuccess(state, action) {
      // console.log("action.payload", action.payload);
      state.loading = false;
      state.borrowRecords = action.payload;
      // console.log("state.borrowRecords", state.borrowRecords);
    },
    borrowedBooksFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addBorrowRecordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBorrowRecordSuccess(state, action) {
      state.loading = false;
      state.borrowRecords.push(action.payload.currentBorrow);
      state.message = action.payload.message;
    },
    addBorrowRecordFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    returnBorrowRecordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBorrowRecordSuccess(state, action) {
      state.loading = false;
      // state.message = action.payload.message;
    },
    returnBorrowRecordFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.myBorrowRecords = action.payload.borrowedBooks;
    },
    getBorrowedBooksFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const BorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.borrowedBooksRequest());

  await axios
    .get(`${import.meta.env.VITE_SERVER}/api/v1/borrow/borrowed-books`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(borrowSlice.actions.borrowedBooksSuccess(res.data.borrowedBook));
    })
    .catch((err) => {
      dispatch(
        borrowSlice.actions.borrowedBooksFailure(err.response.data.message)
      );
    });
};

export const addBorrowRecord = (bookId, memberEmail) => async (dispatch) => {
  dispatch(borrowSlice.actions.addBorrowRecordRequest());

  await axios
    .post(
      `${import.meta.env.VITE_SERVER}/api/v1/borrow/record-borrow/${bookId}`,
      { email: memberEmail },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log("res.data.currentBorrow", res.data.currentBorrow);
      dispatch(borrowSlice.actions.addBorrowRecordSuccess(res.data));
    })
    .catch((err) => {
      dispatch(
        borrowSlice.actions.addBorrowRecordFailure(err.response.data.message)
      );
    });
};

export const returnBorrowRecord = (bookId, memberEmail) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBorrowRecordRequest());
  await axios
    .put(
      `${
        import.meta.env.VITE_SERVER
      }/api/v1/borrow/return-borrowed-book/${bookId}`,
      { email: memberEmail },
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      dispatch(borrowSlice.actions.returnBorrowRecordSuccess(res.data));
    })
    .catch((err) => {
      dispatch(
        borrowSlice.actions.returnBorrowRecordFailure(err.response.data.message)
      );
    });
};

// for user dashboard
export const getBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.getBorrowedBooksRequest());

  await axios
    .get(`${import.meta.env.VITE_SERVER}/api/v1/borrow/my-borrowed-books`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(borrowSlice.actions.getBorrowedBooksSuccess(res.data));
    })
    .catch((err) => {
      dispatch(
        borrowSlice.actions.getBorrowedBooksFailure(err.response.data.message)
      );
    });
};

export default borrowSlice.reducer;
