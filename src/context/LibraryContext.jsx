// import React, { createContext, useContext, useState, useEffect } from "react";
// import {
//   dummyBooks,
//   dummyMembers,
//   dummyBorrowRecords,
//   dummyStats,
//   dummyUsers,
// } from "../utils/dummyData";
// import { useSelector } from "react-redux";

// const LibraryContext = createContext(undefined);

// export const LibraryProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [users, setUsers] = useState(dummyUsers);
//   const [books, setBooks] = useState(dummyBooks);
//   const [members, setMembers] = useState(dummyMembers);
//   const [borrowRecords, setBorrowRecords] = useState(dummyBorrowRecords);
//   const [stats, setStats] = useState(dummyStats);
//   const [toast, setToast] = useState(null);

//   // const { books: bookState } = useSelector((state) => state.book);
//   // setBooks(bookState);

//   const login = async (username, password) => {
//     // Mock authentication for admin
//     if (username === "admin" && password === "admin123") {
//       setUser({
//         id: "1",
//         username: "admin",
//         email: "admin@librento.com",
//         role: "admin",
//       });
//       return true;
//     }
//     return false;
//   };

//   const loginUser = async (email, password) => {
//     const userAccount = users.find(
//       (u) => u.email === email && u.password === password && u.isVerified
//     );
//     if (userAccount) {
//       setUser({
//         id: userAccount.id,
//         username: userAccount.name,
//         email: userAccount.email,
//         role: userAccount.role,
//         name: userAccount.name,
//         phone: userAccount.phone,
//       });
//       return true;
//     }
//     return false;
//   };

//   const register = async (userData) => {
//     // Check if email already exists
//     const existingUser = users.find((u) => u.email === userData.email);
//     if (existingUser) {
//       return false;
//     }

//     const newUser = {
//       ...userData,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString().split("T")[0],
//       isVerified: false,
//       role: "user",
//       otpCode: "123456", // In real app, generate random OTP
//       otpExpiry: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
//     };

//     setUsers((prev) => [...prev, newUser]);
//     showToast("Registration successful! Please verify your email.", "success");
//     return true;
//   };

//   const verifyOtp = async (email, otp) => {
//     const userIndex = users.findIndex((u) => u.email === email);
//     if (userIndex === -1) return false;

//     const user = users[userIndex];
//     if (
//       user.otpCode === otp &&
//       user.otpExpiry &&
//       new Date(user.otpExpiry) > new Date()
//     ) {
//       const updatedUsers = [...users];
//       updatedUsers[userIndex] = {
//         ...user,
//         isVerified: true,
//         otpCode: undefined,
//         otpExpiry: undefined,
//       };
//       setUsers(updatedUsers);
//       showToast("Email verified successfully!", "success");
//       return true;
//     }
//     return false;
//   };

//   const resendOtp = async (email) => {
//     const userIndex = users.findIndex((u) => u.email === email);
//     if (userIndex === -1) return false;

//     const updatedUsers = [...users];
//     updatedUsers[userIndex] = {
//       ...updatedUsers[userIndex],
//       otpCode: "123456", // In real app, generate new random OTP
//       otpExpiry: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
//     };
//     setUsers(updatedUsers);
//     showToast("New OTP sent to your email!", "success");
//     return true;
//   };

//   const forgotPassword = async (email) => {
//     const userIndex = users.findIndex((u) => u.email === email);
//     if (userIndex === -1) return false;

//     const resetToken = "reset_" + Date.now().toString();
//     const updatedUsers = [...users];
//     updatedUsers[userIndex] = {
//       ...updatedUsers[userIndex],
//       resetToken,
//       resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
//     };
//     setUsers(updatedUsers);
//     return true;
//   };

//   const resetPassword = async (token, newPassword) => {
//     const userIndex = users.findIndex(
//       (u) =>
//         u.resetToken === token &&
//         u.resetTokenExpiry &&
//         new Date(u.resetTokenExpiry) > new Date()
//     );

//     if (userIndex === -1) return false;

//     const updatedUsers = [...users];
//     updatedUsers[userIndex] = {
//       ...updatedUsers[userIndex],
//       password: newPassword,
//       resetToken: undefined,
//       resetTokenExpiry: undefined,
//     };
//     setUsers(updatedUsers);
//     return true;
//   };

//   const validateResetToken = async (token) => {
//     const user = users.find(
//       (u) =>
//         u.resetToken === token &&
//         u.resetTokenExpiry &&
//         new Date(u.resetTokenExpiry) > new Date()
//     );
//     return !!user;
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   const addBook = (book) => {
//     const newBook = { ...book, id: Date.now().toString() };
//     setBooks((prev) => [...prev, newBook]);
//     updateStats();
//     showToast("Book added successfully", "success");
//   };

//   const updateBook = (id, updatedBook) => {
//     setBooks((prev) =>
//       prev.map((book) => (book.id === id ? { ...book, ...updatedBook } : book))
//     );
//     updateStats();
//     showToast("Book updated successfully", "success");
//   };

//   const deleteBook = (id) => {
//     setBooks((prev) => prev.filter((book) => book.id !== id));
//     updateStats();
//     showToast("Book deleted successfully", "success");
//   };

//   const searchBooks = (query) => {
//     if (!query) return books;
//     return books.filter(
//       (book) =>
//         book.title.toLowerCase().includes(query.toLowerCase()) ||
//         book.author.toLowerCase().includes(query.toLowerCase()) ||
//         book.isbn.includes(query) ||
//         book.category.toLowerCase().includes(query.toLowerCase())
//     );
//   };

//   const addMember = (member) => {
//     const newMember = { ...member, id: Date.now().toString() };
//     setMembers((prev) => [...prev, newMember]);
//     updateStats();
//     showToast("Member added successfully", "success");
//   };

//   const updateMember = (id, updatedMember) => {
//     setMembers((prev) =>
//       prev.map((member) =>
//         member.id === id ? { ...member, ...updatedMember } : member
//       )
//     );
//     updateStats();
//     showToast("Member updated successfully", "success");
//   };

//   const deleteMember = (id) => {
//     setMembers((prev) => prev.filter((member) => member.id !== id));
//     updateStats();
//     showToast("Member deleted successfully", "success");
//   };

//   const searchMembers = (query) => {
//     if (!query) return members;
//     return members.filter(
//       (member) =>
//         member.name.toLowerCase().includes(query.toLowerCase()) ||
//         member.email.toLowerCase().includes(query.toLowerCase()) ||
//         member.phone.includes(query)
//     );
//   };

//   const borrowBook = (bookId, memberId) => {
//     const book = books.find((b) => b.id === bookId);
//     if (!book || book.availableCopies <= 0) {
//       showToast("Book not available", "error");
//       return false;
//     }

//     const dueDate = new Date();
//     dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now

//     const newRecord = {
//       id: Date.now().toString(),
//       bookId,
//       memberId,
//       borrowDate: new Date().toISOString().split("T")[0],
//       dueDate: dueDate.toISOString().split("T")[0],
//       status: "borrowed",
//     };

//     setBorrowRecords((prev) => [...prev, newRecord]);
//     updateBook(bookId, { availableCopies: book.availableCopies - 1 });
//     showToast("Book borrowed successfully", "success");
//     return true;
//   };

//   const returnBook = (recordId) => {
//     const record = borrowRecords.find((r) => r.id === recordId);
//     if (!record) return;

//     const book = books.find((b) => b.id === record.bookId);
//     if (book) {
//       updateBook(record.bookId, { availableCopies: book.availableCopies + 1 });
//     }

//     setBorrowRecords((prev) =>
//       prev.map((r) =>
//         r.id === recordId
//           ? {
//               ...r,
//               status: "returned",
//               returnDate: new Date().toISOString().split("T")[0],
//             }
//           : r
//       )
//     );
//     showToast("Book returned successfully", "success");
//   };

//   const getBorrowedBooks = () => {
//     return borrowRecords.filter(
//       (record) => record.status === "borrowed" || record.status === "overdue"
//     );
//   };

//   const updateStats = () => {
//     const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
//     const availableBooks = books.reduce(
//       (sum, book) => sum + book.availableCopies,
//       0
//     );
//     const borrowedBooks = borrowRecords.filter(
//       (r) => r.status === "borrowed"
//     ).length;
//     const overdueBooks = borrowRecords.filter(
//       (r) => r.status === "overdue"
//     ).length;
//     const totalMembers = members.filter((m) => m.isActive).length;
//     const monthlyBorrows = borrowRecords.filter((r) => {
//       const borrowDate = new Date(r.borrowDate);
//       const now = new Date();
//       return (
//         borrowDate.getMonth() === now.getMonth() &&
//         borrowDate.getFullYear() === now.getFullYear()
//       );
//     }).length;

//     setStats({
//       totalBooks,
//       totalMembers,
//       borrowedBooks,
//       overdueBooks,
//       availableBooks,
//       monthlyBorrows,
//     });
//   };

//   const showToast = (message, type) => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     updateStats();
//   }, [books, members, borrowRecords]);

//   const value = {
//     user,
//     login,
//     loginUser,
//     register,
//     verifyOtp,
//     resendOtp,
//     forgotPassword,
//     resetPassword,
//     validateResetToken,
//     logout,
//     isAuthenticated: !!user,
//     books,
//     addBook,
//     updateBook,
//     deleteBook,
//     searchBooks,
//     members,
//     addMember,
//     updateMember,
//     deleteMember,
//     searchMembers,
//     borrowRecords,
//     borrowBook,
//     returnBook,
//     getBorrowedBooks,
//     stats,
//     updateStats,
//     showToast,
//     toast,
//   };

//   return (
//     <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
//   );
// };

// export const useLibrary = () => {
//   const context = useContext(LibraryContext);
//   if (context === undefined) {
//     throw new Error("useLibrary must be used within a LibraryProvider");
//   }
//   return context;
// };
