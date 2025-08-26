import { Edit, Eye, Search, Trash2, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import useUserApi from "../api/user.api";
import type { UserInfo } from "@/Shared/lib/adminType";

import { Button } from "@/Shared/components/ui/button";
import LoadingSpinner from "@/Shared/components/ui/loading";
import { Badge } from "@/Shared/components/ui/badge";
import EmptyCase from "@/Shared/components/empty/EmptyCase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Shared/components/ui/table";
import { Toaster } from "sonner";

const UserManagement = () => {
  const { getUsers } = useUserApi();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [editingUserId, setEditingUserId] = useState<string>("");
  const [deletingUserId, setDeletingUserId] = useState<string>("");
  const [showMore, setShowMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUsers(1);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchUsers = async (currentPage: number) => {
    const result = await getUsers(currentPage);
    console.log(result);
    if (result && result.data) {
      setUsers((prev) => {
        if (result.data) {
          const updatedResult = [...prev, ...result.data];
          return currentPage === 1 ? result.data : updatedResult;
        }
        return prev;
      });
      setShowMore(result.final as boolean);
    }
  };

  const handleShowMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setShowMoreLoading(true);
    await fetchUsers(nextPage);
    setShowMoreLoading(false);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and monitor all registered users on the platform
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg 
                         text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         transition-colors"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:shadow-lg dark:shadow-gray-900/25">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium py-3">
                  User
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium py-3">
                  Role
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium py-3">
                  Status
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium py-3">
                  Join Date
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium py-3">
                  Last Action
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium py-3 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <LoadingSpinner size={40} />
                  </td>
                </tr>
              )}

              {filteredUsers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyCase
                      title={
                        users.length === 0
                          ? "No Users Available"
                          : "No Matches Found"
                      }
                      icon={<User />}
                      color="blue"
                      description={
                        users.length === 0
                          ? "There are no users in the system yet."
                          : "No users matched your search. Try a different keyword."
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {user.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className={
                          user.role === "admin"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          user.status === "active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {user.created_at?.split("T")[0]}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      27/11/2025
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUserId(user.clerk_id)}
                          className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingUserId(user.clerk_id)}
                          className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Show More */}
        {showMore && (
          <div className="flex justify-center mt-6">
            <Button
              disabled={showMoreLoading}
              onClick={handleShowMore}
              variant="outline"
            >
              Show More Users
            </Button>
          </div>
        )}

        {/* Modals */}
        {editingUserId && (
          <EditModal
            userId={editingUserId}
            onClose={() => setEditingUserId("")}
            onUpdate={setUsers}
          />
        )}

        {selectedUser && (
          <UserViewModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}

        {deletingUserId && (
          <DeleteModal
            userId={deletingUserId}
            onClose={() => setDeletingUserId("")}
            onUpdate={setUsers}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
};

// Modal Backdrop Component
const ModalBackdrop = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

// Edit Modal
const EditModal = ({
  userId,
  onClose,
  onUpdate,
}: {
  userId: string;
  onClose: () => void;
  onUpdate: React.Dispatch<React.SetStateAction<UserInfo[]>>;
}) => {
  const [status, setStatus] = useState("active");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUserApi();

  const handleSubmit = async () => {
    setLoading(true);
    const result = await updateUser(userId, role, status);
    if (result) {
      onUpdate((prev) =>
        prev.map((user) => (user.clerk_id === userId ? result : user))
      );
      onClose();
    }
    setLoading(false);
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-[400px] max-w-sm shadow-lg dark:shadow-xl dark:shadow-gray-900/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Edit User
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 
               dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? <LoadingSpinner size={16} thickness={2} /> : "Save"}
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

// View Modal
const UserViewModal = ({
  user,
  onClose,
}: {
  user: UserInfo;
  onClose: () => void;
}) => (
  <ModalBackdrop onClose={onClose}>
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-[400px]  shadow-lg dark:shadow-xl dark:shadow-gray-900/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          User Details
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Details */}
      <div className="space-y-3">
        {[
          { label: "Name", value: user.name },
          { label: "Email", value: user.email },
          { label: "Role", value: user.role },
          { label: "Status", value: user.status },
          { label: "Join Date", value: user.created_at?.split("T")[0] },
          { label: "Last Action", value: "27/11/2025" },
          { label: "Streak", value: user.streak_count },
          { label: "XP", value: user.xp },
          { label: "Level", value: user.level },
        ].map((item) => (
          <div key={item.label} className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}:
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  </ModalBackdrop>
);

// Delete Modal
const DeleteModal = ({
  userId,
  onClose,
  onUpdate,
}: {
  userId: string;
  onClose: () => void;
  onUpdate: React.Dispatch<React.SetStateAction<UserInfo[]>>;
}) => {
  const [loading, setLoading] = useState(false);
  const { deleteUser } = useUserApi();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteUser(userId);
    if(result){
      onUpdate((prev) => prev.filter((user) => user.clerk_id !== userId));
    }
    onClose();
    setLoading(false);
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-sm shadow-lg dark:shadow-xl dark:shadow-gray-900/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Delete User
          </h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 text-white hover:bg-red-700 
               dark:bg-red-500 dark:hover:bg-red-600"
          >
            {loading ? <LoadingSpinner size={16} thickness={2} /> : "Delete"}
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default UserManagement;
