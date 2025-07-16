import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Filter,
  LogOut,
  Search,
  Star,
  Tag,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const UserBooks = () => {
  // const { books } = useLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.book);

  // Filter and sort books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "author":
        return a.author.localeCompare(b.author);
      case "year":
        return b.publishYear - a.publishYear;
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  // Get unique categories
  const categories = [...new Set(books.map((book) => book.category))];

  const getCategoryColor = (category) => {
    const colors = {
      Fiction: "bg-purple-100 text-purple-800",
      "Non-Fiction": "bg-blue-100 text-blue-800",
      Technology: "bg-green-100 text-green-800",
      Science: "bg-yellow-100 text-yellow-800",
      History: "bg-red-100 text-red-800",
      Biography: "bg-indigo-100 text-indigo-800",
      Educational: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/user/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Library Books
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name || "User"}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Books
          </h1>
          <p className="text-gray-600">
            Discover and explore our library collection
          </p>
          <p className="text-sm text-blue-800">
            • Books can be borrowed for 14 days
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="year">Sort by Year</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Book Cover */}
              <div className="h-48 m-2 border flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full object-contain"
                />
              </div>

              {/* Book Details */}
              <div className="p-6">
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                      book.category
                    )}`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {book.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  ₹{book.price}
                </h3>
                <p className="text-gray-600 mb-3">{book.author}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {book.publishYear}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {book.availableCopies}/{book.totalCopies} available
                  </div>
                </div>

                {book.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {book.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.availableCopies > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.availableCopies > 0 ? "Available" : "Not Available"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {books.length}
              </div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {books.reduce((sum, book) => sum + book.availableCopies, 0)}
              </div>
              <div className="text-sm text-gray-600">Available Copies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {sortedBooks.length}
              </div>
              <div className="text-sm text-gray-600">Search Results</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBooks;
