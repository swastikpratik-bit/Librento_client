import { Calendar, Plus, RotateCcw, Search, User } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  addBorrowRecord,
  BorrowedBooks,
  returnBorrowRecord,
} from "../../../../store/slices/borrowSlice";
import Modal from "../../common/Modal";
import Table from "../../common/Table";

import { toast } from "react-toastify";
import ConfirmDialog from "../../../extra/ConfirmDialog";

const BorrowReturn = () => {
  const {
    borrowRecords: borrowdataFromStore,
    loading,
    error,
    message,
  } = useSelector((state) => state.borrow);
  const { books, loading: bookLoading } = useSelector((state) => state.book);
  const { users, loading: userLoading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(BorrowedBooks());
  }, [dispatch, loading, message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message]);

  const members = users || [{}];

  const borrowRecords = borrowdataFromStore || [{}];

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    bookId: "",
    memberEmail: "",
  });

  // bill

  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState(null);

  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((today - due) / (1000 * 60 * 60 * 24)); // in days
    return diff > 0 ? diff * 5 : 0; // ₹5 per day fine
  };

  // Confirm Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const handleReturnClick = (bookId, memberEmail) => {
    setSelectedReturn({ bookId, memberEmail });
    setConfirmOpen(true);
  };

  const handleReturnConfirm = () => {
    const { bookId, memberEmail } = selectedReturn;

    dispatch(returnBorrowRecord(bookId, memberEmail));

    const returnedRecord = borrowRecords.find(
      (r) => r.book === bookId && r.user.email === memberEmail
    );

    const book = books.find((b) => b._id === bookId);
    const member = members.find((m) => m.email === memberEmail);
    const fine = calculateFine(returnedRecord?.dueDate);
    const price = book?.price || 0;

    setBillData({
      memberName: member?.name,
      memberEmail,
      bookTitle: book?.title,
      bookPrice: price,
      borrowDate: returnedRecord?.borrowDate,
      dueDate: returnedRecord?.dueDate,
      returnDate: new Date().toISOString(),
      fine,
      total: price + fine,
    });

    setShowBill(true);
  };

  const filteredRecords = borrowRecords
    .map((record) => {
      const book = books.find((b) => b._id === record.book);
      const member = members.find((m) => m._id === record.user.id);

      const derivedStatus = record.returnDate
        ? "returned"
        : new Date(record.dueDate) < new Date()
        ? "overdue"
        : "borrowed";

      return {
        ...record,
        bookData: book,
        memberData: member,
        status: derivedStatus,
      };
    })
    .filter((record) => {
      const matchesSearch =
        !searchQuery ||
        record.bookData?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        record.memberData?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortKey) return 0;

    const aValue =
      sortKey === "memberName"
        ? a.memberData?.name
        : sortKey === "bookTitle"
        ? a.bookData?.title
        : a[sortKey];

    const bValue =
      sortKey === "memberName"
        ? b.memberData?.name
        : sortKey === "bookTitle"
        ? b.bookData?.title
        : b[sortKey];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (key, direction) => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.bookId && formData.memberEmail) {
      dispatch(addBorrowRecord(formData.bookId, formData.memberEmail));
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({ bookId: "", memberEmail: "" });
    setIsModalOpen(false);
  };

  const handleReturn = (bookId, memberEmail) => {
    if (confirm("Are you sure you want to return this book?")) {
      dispatch(returnBorrowRecord(bookId, memberEmail));
    }
  };

  const getStatusColor = (status, dueDate) => {
    if (status === "returned") {
      return "bg-green-100 text-green-800";
    } else if (
      status === "overdue" ||
      (status === "borrowed" && new Date(dueDate) < new Date())
    ) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status, dueDate) => {
    if (status === "returned") {
      return "Returned";
    } else if (
      status === "overdue" ||
      (status === "borrowed" && new Date(dueDate) < new Date())
    ) {
      return "Overdue";
    } else {
      return "Borrowed";
    }
  };

  const columns = [
    {
      key: "bookTitle",
      label: "Book",
      sortable: true,
      render: (_, record) => {
        const book = books.find((b) => {
          return b._id === record.book;
        });
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              {/* <BookOpen className="w-5 h-5 text-white" /> */}
              <img src={book?.coverImage} alt={book?.title} className="" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {book?.title || "Unknown Book"}
              </div>
              <div className="text-sm text-gray-600">
                {book?.author || "Unknown Author"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "memberName",
      label: "Member",
      sortable: true,
      render: (_, record) => {
        const member = members.find((m) => m._id === record.user.id);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {member?.name || "Unknown Member"}
              </div>
              <div className="text-sm text-gray-600">
                {member?.email || "Unknown Email"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "borrowDate",
      label: "Borrow Date",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="w-3 h-3" />
          {new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (value, record) => {
        const isOverdue =
          new Date(value) < new Date() && record.status !== "returned";
        return (
          <div
            className={`flex items-center gap-1 text-sm ${
              isOverdue ? "text-red-600" : "text-gray-600"
            }`}
          >
            <Calendar className="w-3 h-3" />
            {new Date(value).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (_, record) => {
        const status = record.returnDate ? "returned" : "borrowed";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              status,
              record.dueDate
            )}`}
          >
            {getStatusText(status, record.dueDate)}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, record) => {
        const isReturned = !!record.returnDate;
        return (
          <div className="flex items-center gap-2">
            {!isReturned && (
              <button
                onClick={() =>
                  handleReturnClick(record.book, record.user.email)
                }
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Return Book"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const availableBooks = books.filter((book) => book.availableCopies > 0);

  return (
    <div className="p-6 space-y-6">
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleReturnConfirm}
        message="Are you sure you want to return this book?"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Borrow/Return Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Borrow
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            id="search"
            type="text"
            placeholder="Search by book title or member name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          columns={columns}
          data={sortedRecords}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      </div>

      {/* bill */}
      <Modal
        isOpen={showBill}
        onClose={() => setShowBill(false)}
        title="Return Bill Summary"
        size="md"
      >
        {billData && (
          <div className="space-y-3 text-sm text-gray-800">
            <div>
              <strong>Member:</strong> {billData.memberName} (
              {billData.memberEmail})
            </div>
            <div>
              <strong>Book:</strong> {billData.bookTitle}
            </div>
            <div>
              <strong>Borrow Date:</strong>{" "}
              {new Date(billData.borrowDate).toLocaleDateString("en-GB")}
            </div>
            <div>
              <strong>Due Date:</strong>{" "}
              {new Date(billData.dueDate).toLocaleDateString("en-GB")}
            </div>
            <div>
              <strong>Return Date:</strong>{" "}
              {new Date(billData.returnDate).toLocaleDateString("en-GB")}
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span>Book Price:</span>
              <span>₹{billData.bookPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Fine:</span>
              <span>₹{billData.fine}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total Amount:</span>
              <span>₹{billData.total}</span>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
              >
                Print Bill
              </button>
              <button
                onClick={() => setShowBill(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title="New Book Borrow"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bookId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Book
            </label>
            <select
              id="bookId"
              name="bookId"
              value={formData.bookId}
              onChange={(e) =>
                setFormData({ ...formData, bookId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Choose a book...</option>
              {availableBooks.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} - {book.author} ({book.availableCopies}{" "}
                  available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="memberId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Member
            </label>
            <select
              id="memberId"
              name="memberId"
              value={formData.memberEmail}
              onChange={(e) =>
                setFormData({ ...formData, memberEmail: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Choose a member...</option>
              {members.map((member) => (
                <option key={member._id} value={member.email}>
                  {member.name} - {member.email} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Borrow Information
            </h4>
            <p className="text-sm text-blue-800">
              • Books can be borrowed for 14 days
            </p>
            <p className="text-sm text-blue-800">
              • Late returns may incur fines
            </p>
            <p className="text-sm text-blue-800">
              • Due date:{" "}
              {new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-4 rounded-md hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
            >
              Borrow Book
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

export default BorrowReturn;
