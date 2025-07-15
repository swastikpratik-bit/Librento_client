import { Mail, Phone, Search, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, updateUser } from "../../../../store/slices/userSlice";
import { dummyUsers } from "../../../../utils/dummyData";
import Table from "../../common/Table";

const Members = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch, isModalOpen]);

  const members = users || dummyUsers;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "general",
    isActive: true,
  });

  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase();
    const name = member.name || "";
    const email = member.email || "";
    const phone = member.phone ? member.phone.toString() : "";

    return (
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      phone.includes(query)
    );
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (key, direction) => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingMember) {
      dispatch(updateUser(editingMember._id, formData));
    } else {
      addMember({
        ...formData,
        joinDate: new Date().toISOString().split("T")[0],
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      membershipType: "general",
      isActive: true,
    });
    setEditingMember(null);
    setIsModalOpen(false);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      membershipType: member.membershipType,
      isActive: member.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (memberId) => {
    if (confirm("Are you sure you want to delete this member?")) {
      deleteMember(memberId);
    }
  };

  const getMembershipColor = (type) => {
    switch (type) {
      case "Admin":
        return "bg-blue-100 text-blue-800";
      case "User":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "name",
      label: "Member",
      sortable: true,
      render: (value, member) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {member.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Phone className="w-3 h-3" />
          {value}
        </div>
      ),
    },
    {
      key: "role",
      label: "Type",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMembershipColor(
            value
          )}`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Join Date",
      sortable: true,
      render: (value) =>
        new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
        {/* <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button> */}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          id="search"
          type="text"
          placeholder="Search members by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          columns={columns}
          data={sortedMembers}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      </div>

      {/* Add/Edit Modal */}
      {/* <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingMember ? "Edit Member" : "Add New Member"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membership Type
              </label>
              <select
                value={formData.membershipType}
                onChange={(e) =>
                  setFormData({ ...formData, membershipType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="general">General</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active Member
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-4 rounded-md hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
            >
              {editingMember ? "Update Member" : "Add Member"}
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
      </Modal> */}
    </div>
  );
};

export default Members;
