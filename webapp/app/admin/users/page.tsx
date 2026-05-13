"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import AdminSidebar from "@/src/components/AdminSidebar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";
import { getSessionUser } from "@/src/lib/session";

type UserRow = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  address: string;
  created_at: string;
};

type ModalMode = "create" | "edit";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "customer" as "customer" | "admin",
  phone: "",
  address: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const session = typeof window !== "undefined" ? getSessionUser() : null;

  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchJson<UserRow[]>("/api/admin/users");
      queueMicrotask(() => {
        setUsers(Array.isArray(data) ? data : []);
        setError("");
      });
    } catch (e) {
      console.error(e);
      queueMicrotask(() => {
        setError("Failed to load users.");
      });
    } finally {
      queueMicrotask(() => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadUsers();
    });
  }, [loadUsers]);

  function openCreate() {
    setModalMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(u: UserRow) {
    setModalMode("edit");
    setEditingId(u.user_id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role === "admin" ? "admin" : "customer",
      phone: u.phone ?? "",
      address: u.address,
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (modalMode === "create" && !form.password.trim()) {
      setFormError("Password is required for new users.");
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setFormError("Name, email, and address are required.");
      return;
    }

    try {
      setSaving(true);
      if (modalMode === "create") {
        await fetchJson<{ user_id: number }>("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
            address: form.address.trim(),
            phone: form.phone.trim() || null,
          }),
        });
      } else if (editingId != null) {
        const payload: Record<string, unknown> = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          address: form.address.trim(),
          phone: form.phone.trim() || null,
        };
        if (form.password.trim()) {
          payload.password = form.password.trim();
        }
        await fetchJson(`/api/admin/users/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      await loadUsers();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Request failed."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u: UserRow) {
    if (session?.user_id === u.user_id) {
      alert("You cannot delete your own account while logged in.");
      return;
    }
    if (!window.confirm(`Delete user ${u.name} (${u.email})? This cannot be undone.`)) {
      return;
    }
    try {
      await fetchJson(`/api/admin/users/${u.user_id}`, { method: "DELETE" });
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        <AdminSidebar />

        <main className="flex-1 w-full max-w-[100vw] md:max-w-none p-6 md:p-10 lg:p-12 overflow-x-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mb-3"
              >
                <FiArrowLeft size={16} />
                Back to dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FiUsers size={22} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Users
                  </h1>
                  <p className="text-slate-500 text-sm md:text-base">
                    Create, edit, or remove accounts. Assign admin or customer.
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-orange-500 transition-colors shadow-lg shrink-0"
            >
              <FiPlus size={18} />
              Add user
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3">
              <FiAlertCircle className="shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-gray-100">
              <FiLoader className="animate-spin text-orange-500 mb-4" size={36} />
              <p className="text-slate-600 font-medium">Loading users…</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[920px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        ID
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Name
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Email
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Role
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Phone
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Joined
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-12 text-center text-slate-500 font-medium"
                        >
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr
                          key={u.user_id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="p-4 font-mono text-slate-600">
                            {u.user_id}
                          </td>
                          <td className="p-4 font-semibold text-slate-900">
                            {u.name}
                          </td>
                          <td className="p-4 text-slate-600 max-w-[200px] truncate">
                            {u.email}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                u.role === "admin"
                                  ? "bg-purple-50 text-purple-800 border-purple-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 whitespace-nowrap">
                            {u.phone ?? "—"}
                          </td>
                          <td className="p-4 text-slate-500 whitespace-nowrap">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(u)}
                                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors"
                                aria-label="Edit user"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(u)}
                                disabled={session?.user_id === u.user_id}
                                className="p-2 rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                aria-label="Delete user"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {modalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div
                className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {modalMode === "create" ? "Add user" : "Edit user"}
                  </h2>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close"
                  >
                    <FiX size={22} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Full name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                      placeholder={
                        modalMode === "edit"
                          ? "Leave blank to keep current password"
                          : ""
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Role
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          role: e.target.value as "customer" | "admin",
                        }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Phone (optional)
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.address}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, address: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-3 rounded-xl font-bold border border-gray-200 text-slate-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-orange-500 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {saving && (
                        <FiLoader className="animate-spin" size={18} />
                      )}
                      {modalMode === "create" ? "Create user" : "Save changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
