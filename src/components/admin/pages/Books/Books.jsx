import { Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  addBook,
  deleteBook,
  getBooks,
  updateBook,
} from "../../../../store/slices/bookSlice";

import ConfirmDialog from "../../../extra/ConfirmDialog";
import Modal from "../../common/Modal";
import Table from "../../common/Table";

const initialFormState = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publishYear: new Date().getFullYear(),
  totalCopies: 1,
  availableCopies: 1,
  description: "",
  coverImage: "",
  price: null,
};

const categoryColors = {
  Fiction: "bg-purple-100 text-purple-800",
  "Non-Fiction": "bg-blue-100 text-blue-800",
  Technology: "bg-green-100 text-green-800",
  Science: "bg-yellow-100 text-yellow-800",
  History: "bg-red-100 text-red-800",
  Biography: "bg-indigo-100 text-indigo-800",
  Educational: "bg-pink-100 text-pink-800",
  Romance: "bg-pink-100 text-pink-800",
  Adventure: "bg-orange-100 text-orange-800",
  Mystery: "bg-indigo-100 text-indigo-800",
  Fantasy: "bg-fuchsia-100 text-fuchsia-800",
  Horror: "bg-gray-200 text-gray-800",
  "Self-Help": "bg-teal-100 text-teal-800",
  Business: "bg-yellow-100 text-yellow-900",
  Comics: "bg-cyan-100 text-cyan-800",
  Poetry: "bg-lime-100 text-lime-800",
};

const getCategoryColor = (category) =>
  categoryColors[category] || "bg-gray-100 text-gray-800";

const Books = () => {
  const dispatch = useDispatch();
  const { books, loading, error, message } = useSelector((state) => state.book);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    bookId: null,
  });

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
    if (message) toast.success(message.message);
  }, [error, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editingBook ? updateBook : addBook;
    dispatch(action(formData)).then(() => {
      dispatch(getBooks());
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingBook(null);
    setIsModalOpen(false);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData(book);
    setIsModalOpen(true);
  };

  const handleDelete = (bookId) => {
    setConfirmDelete({ open: true, bookId });
  };

  const handleSort = (key) => {
    setSortKey(key);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    const compare =
      typeof aValue === "string"
        ? aValue.localeCompare(bValue)
        : aValue - bValue;

    return sortDirection === "asc" ? compare : -compare;
  });

  const categories = [...new Set(books.map((b) => b.category))];

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (value, book) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-600">{book.author}</div>
          </div>
        </div>
      ),
    },
    {
      key: "isbn",
      label: "ISBN",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "publishYear",
      label: "Year",
      sortable: true,
    },
    {
      key: "availableCopies",
      label: "Available/Total",
      render: (value, book) => (
        <span
          className={`font-medium ${
            value > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {value}/{book.totalCopies}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, book) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(book)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(book._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, bookId: null })}
        onConfirm={() => {
          dispatch(deleteBook(confirmDelete.bookId)).then(() => {
            dispatch(getBooks());
            setConfirmDelete({ open: false, bookId: null });
          });
        }}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Books Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      {/* Search & Filters */}
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => {
              setSortKey(e.target.value);
              setSortDirection("asc");
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="publishYear">Sort by Year</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          columns={columns}
          data={sortedBooks}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingBook ? "Edit Book" : "Add New Book"}
        size="lg"
      >
        {/* Your form is already well-structured. You may keep it as-is or modularize it in a separate component */}
        {/* Tip: Consider extracting it into `<BookForm />` if reused elsewhere */}
        {/* Keeping original form untouched below this */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Adventure">Adventure</option>
                <option value="Biography">Biography</option>
                <option value="Business">Business</option>
                <option value="Comics">Comics</option>
                <option value="Educational">Educational</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Fiction">Fiction</option>
                <option value="History">History</option>
                <option value="Horror">Horror</option>
                <option value="Mystery">Mystery</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Poetry">Poetry</option>
                <option value="Romance">Romance</option>
                <option value="Science">Science</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Technology">Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Year
              </label>
              <input
                type="number"
                value={formData.publishYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishYear: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Copies
              </label>
              <input
                type="number"
                value={formData.totalCopies}
                onChange={(e) => {
                  const total = parseInt(e.target.value);
                  setFormData({
                    ...formData,
                    totalCopies: total,
                    availableCopies: Math.min(formData.availableCopies, total),
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Description..."
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-4 rounded-md hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
            >
              {editingBook ? "Update Book" : "Add Book"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Books;
