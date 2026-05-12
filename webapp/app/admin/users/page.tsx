"use client";

import { useCallback, useEffect, useState } from "react";

import AdminSidebar from "@/src/components/AdminSidebar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";
import { getSessionUser } from "@/src/lib/session";

type UserRow = {
  user_id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"customer" | "admin">("customer");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchJson<UserRow[]>(
        `/api/admin/users?query=${encodeURIComponent(query)}`
      );
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      await fetchJson<{ success: boolean; user_id: number }>(
        "/api/admin/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newName,
            email: newEmail,
            password: newPassword,
            role: newRole,
            phone: newPhone || null,
            address: newAddress,
          }),
        }
      );
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("customer");
      setNewPhone("");
      setNewAddress("");
      setMessage("User created successfully.");
      await loadUsers();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to create user."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser(user: UserRow) {
    const actor = getSessionUser();
    if (
      !window.confirm(
        `Delete user #${user.user_id} (${user.email})? Related orders and reviews are removed by database rules (CASCADE).`
      )
    ) {
      return;
    }
    setMessage("");
    try {
      const params = new URLSearchParams({ user_id: String(user.user_id) });
      if (actor?.user_id) {
        params.set("actor_user_id", String(actor.user_id));
      }
      await fetchJson<{ success: boolean }>(`/api/admin/users?${params}`, {
        method: "DELETE",
      });
      setMessage("User deleted.");
      await loadUsers();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to delete user."
      );
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-100 md:flex">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">
            Search accounts, create new users, or remove users from the database.
          </p>

          {message && (
            <p
              className={`mt-4 text-sm font-medium ${
                message.includes("success") || message.includes("deleted")
                  ? "text-green-700"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <section className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-2xl">
            <h2 className="text-lg font-bold text-gray-900">Add user</h2>
            <p className="text-sm text-gray-500 mt-1">
              Inserts into <code className="text-xs bg-gray-100 px-1 rounded">Users</code> via{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">POST /api/admin/users</code>{" "}
              (parameterised SQL, mysql2 promise pool).
            </p>
            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Name
                </label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Password
                </label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value as "customer" | "admin")
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="customer">customer</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Phone (optional, must be unique if set)
                </label>
                <input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                  placeholder="03XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Address (required)
                </label>
                <input
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Create user"}
              </button>
            </form>
          </section>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="mt-8 w-full md:w-96 border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm"
          />

          <section className="mt-6 surface-card overflow-x-auto">
            <table className="data-table min-w-[860px]">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading &&
                  users.map((user) => (
                    <tr key={user.user_id}>
                      <td>#{user.user_id}</td>
                      <td className="font-medium text-gray-900">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`pill-badge ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => void handleDeleteUser(user)}
                          className="text-sm font-semibold text-red-600 hover:text-red-800 px-3 py-1 rounded-lg hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
