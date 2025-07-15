import { AlertTriangle, BookOpen, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../../../../store/slices/bookSlice";
import { BorrowedBooks } from "../../../../store/slices/borrowSlice";
import { getUsers } from "../../../../store/slices/userSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const { borrowRecords } = useSelector((state) => state.borrow);
  const { users: members } = useSelector((state) => state.user);

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
    availableBooks: 0,
    monthlyBorrows: 0,
  });

  useEffect(() => {
    dispatch(getBooks());
    dispatch(BorrowedBooks());
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
    const availableBooks = books.reduce(
      (sum, book) => sum + book.availableCopies,
      0
    );
    const borrowedBooks = borrowRecords.filter(
      (r) => !r.returnDate && new Date(r.dueDate) >= new Date()
    ).length;
    const overdueBooks = borrowRecords.filter(
      (r) => !r.returnDate && new Date(r.dueDate) < new Date()
    ).length;
    const totalMembers = members.filter((m) => m.role === "User").length;
    const now = new Date();
    const monthlyBorrows = borrowRecords.filter((r) => {
      const borrowDate = new Date(r.borrowDate);
      return (
        borrowDate.getMonth() === now.getMonth() &&
        borrowDate.getFullYear() === now.getFullYear()
      );
    }).length;

    setStats({
      totalBooks,
      availableBooks,
      borrowedBooks,
      overdueBooks,
      totalMembers,
      monthlyBorrows,
    });
  }, [books, borrowRecords, members]);

  const borrowedBooks = borrowRecords.filter((r) => !r.returnDate);

  const recentBooks = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentMembers = [...members]
    .filter((m) => m.role === "User")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Members",
      value: stats.totalMembers,
      icon: Users,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Borrowed Books",
      value: stats.borrowedBooks,
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Monthly Borrows",
      value: stats.monthlyBorrows,
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: AlertTriangle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Available Books",
      value: stats.availableBooks,
      icon: BookOpen,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} p-6 rounded-xl border border-gray-100`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Books
          </h3>
          <div className="space-y-3">
            {recentBooks.map((book) => (
              <div
                key={book._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {book.availableCopies}/{book.totalCopies}
                  </p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Members
          </h3>
          <div className="space-y-3">
            {recentMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.role === "User"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Borrowings
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Book
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Member
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Due Date
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.slice(0, 5).map((record) => {
                const book = books.find((b) => b._id === record.book);
                const member = members.find((m) => m._id === record.user?.id);
                const isOverdue =
                  !record.returnDate && new Date(record.dueDate) < new Date();

                return (
                  <tr key={record._id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">
                      {book?.title || "Unknown"}
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {member?.name || "Unknown"}
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {new Date(record.dueDate).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isOverdue
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {isOverdue ? "Overdue" : "Borrowed"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
