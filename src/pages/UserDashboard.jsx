import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  LogOut,
  Search,
  User,
} from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../store/slices/authSlice";
import { getBooks } from "../store/slices/bookSlice";
import { getBorrowedBooks } from "../store/slices/borrowSlice";
import LoaderSpinner from "../components/extra/LoaderSpinner";

const UserDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBorrowedBooks());
    dispatch(getBooks());
  }, [dispatch]);

  const { myBorrowRecords, loading: borrowLoading } = useSelector(
    (state) => state.borrow
  );
  const {
    user,
    loading: userLoading,
    isAuthenticated,
  } = useSelector((state) => state.auth);
  const { books, loading: bookLoading } = useSelector((state) => state.book);

  const handleLogout = () => {
    dispatch(logout());
  };

  const currentlyBorrowed = myBorrowRecords.filter(
    (record) => record.returned === false
  );

  const overdueBooks = myBorrowRecords.filter(
    (record) =>
      record.returned === false && new Date(record.dueDate) < new Date()
  );
  const borrowHistory = myBorrowRecords.filter(
    (record) => record.returned === true
  );

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const navigate = useNavigate();

  if (borrowLoading || userLoading || bookLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Librento</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/user/books")}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Browse Books</span>
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user?.name || "John Doe"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "John"}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your library activity
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate("/user/books")}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Browse Books</h3>
                <p className="text-emerald-100">
                  Explore our collection of {books.length} books
                </p>
              </div>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                • {books.filter((book) => book.availableCopies > 0).length}{" "}
                books available
              </p>
              <p>
                • {[...new Set(books.map((book) => book.category))].length}{" "}
                categories
              </p>
              <p>• {currentlyBorrowed.length} books currently borrowed</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Currently Borrowed
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentlyBorrowed.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overdue Books
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {overdueBooks.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Books Read</p>
                <p className="text-2xl font-bold text-green-600">
                  {borrowHistory.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Currently Borrowed Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Currently Borrowed Books
            </h2>
          </div>
          <div className="p-6">
            {currentlyBorrowed.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-4">No books currently borrowed</p>
                <button
                  onClick={() => navigate("/user/books")}
                  className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Browse Books
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentlyBorrowed.map((record) => {
                  const book = books.find((b) => b._id === record.bookId);
                  const daysUntilDue = getDaysUntilDue(record.dueDate);
                  const isOverdue = daysUntilDue < 0;

                  return (
                    <div
                      key={record._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                        {/* <BookOpen className="w-6 h-6 text-white" /> */}
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {book?.title}
                        </h3>
                        <p className="text-sm text-gray-600">{book?.author}</p>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <Calendar className="w-3 h-3" />
                          Due: {record.dueDate}
                        </div>
                        <div
                          className={`flex items-center gap-1 text-sm ${
                            isOverdue
                              ? "text-red-600"
                              : daysUntilDue <= 3
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {isOverdue
                            ? `${Math.abs(daysUntilDue)} days overdue`
                            : `${daysUntilDue} days left`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Reading History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Reading History
            </h2>
          </div>
          <div className="p-6">
            {borrowHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No reading history yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {borrowHistory.slice(0, 5).map((record) => {
                  const book = books.find((book) => book._id === record.bookId);

                  return (
                    <div
                      key={record._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        {/* <BookOpen className="w-6 h-6 text-white" /> */}
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {book?.title}
                        </h3>
                        <p className="text-sm text-gray-600">{book?.author}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Borrowed: {record.borrowedDate.split("T")[0]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
