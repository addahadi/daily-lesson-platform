import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import {  Edit, Eye, Search, Trash2, Trash2Icon, X} from "lucide-react";
import { useEffect, useState} from "react";
import useUserApi from "../api/user.api";
import type { UserInfo } from "@/lib/adminType";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";

const UserManagement = () => {
  const { getUsers } = useUserApi();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [editingUserId, setEditingUserId] = useState<string>("");
  const [deletingUserId, setDeletingUserId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUsers();
      if (result) {
        setUsers(result);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen  bg-white  p-6">
      <div className=" w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary mb-2">
            User Management
          </h1>
          <p className="text-text-secondary">
            Manage and monitor platform users
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg 
                         text-text-primary placeholder:text-text-tertiary
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-colors"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-subtle">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-text-secondary font-medium py-3">
                  User
                </TableHead>
                <TableHead className="text-text-secondary font-medium py-3">
                  Role
                </TableHead>
                <TableHead className="text-text-secondary font-medium py-3">
                  Status
                </TableHead>
                <TableHead className="text-text-secondary font-medium py-3">
                  Join Date
                </TableHead>
                <TableHead className="text-text-secondary font-medium py-3">
                  Last Action
                </TableHead>
                <TableHead className="text-text-secondary font-medium py-3 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className="border-border hover:bg-surface-hover transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-text-primary">
                        {user.name}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={
                        user.role === "admin"
                          ? "bg-blue-subtle text-blue-primary border-blue-primary/20"
                          : "bg-surface-subtle text-text-secondary"
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
                          ? "bg-green-subtle text-green-primary border-green-primary/20"
                          : "bg-red-subtle text-red-primary border-red-primary/20"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {user.created_at?.split("T")[0]}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    27/11/2025
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="h-8 w-8 p-0 text-text-tertiary hover:text-text-primary hover:bg-surface-hover"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUserId(user.clerk_id)}
                        className="h-8 w-8 p-0 text-text-tertiary hover:text-blue-primary hover:bg-blue-subtle"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingUserId(user.clerk_id)}
                        className="h-8 w-8 p-0 text-text-tertiary hover:text-red-primary hover:bg-red-subtle"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
      <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-sm shadow-medium">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">Edit User</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-text-tertiary hover:text-text-primary hover:bg-surface-hover"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
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
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
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
    <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-sm shadow-medium">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">
          User Details
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-text-tertiary hover:text-text-primary hover:bg-surface-hover"
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
            <span className="text-sm text-text-secondary">{item.label}:</span>
            <span className="text-sm text-text-primary font-medium">
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
    try {
      setLoading(true);
      await deleteUser(userId);
      onUpdate((prev) => prev.filter((user) => user.clerk_id !== userId));
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-sm shadow-medium">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Delete User
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-text-tertiary hover:text-text-primary hover:bg-surface-hover"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1"
          >
            {loading ? <LoadingSpinner size={16} thickness={2} /> : "Delete"}
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default UserManagement;