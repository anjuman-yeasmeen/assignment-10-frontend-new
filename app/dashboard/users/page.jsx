"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { api, apiError } from "@/lib/api";
import { useTitle } from "@/lib/use-title";
import Spinner from "@/components/Spinner";

export default function ManageUsersPage() {
  useTitle("Manage Users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/api/users")
      .then((r) => setUsers(r.data.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const toggleStatus = async (u) => {
    const status = u.status === "active" ? "suspended" : "active";
    try {
      await api.patch(`/api/users/${u._id}/status`, { status });
      toast.success(`User ${status}`);
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const remove = async (u) => {
    const res = await Swal.fire({
      title: `Delete ${u.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/api/users/${u._id}`);
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <Spinner label="Loading users…" />;

  return (
    <div>
      <h1 className="heading mb-6">Manage Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-slate-100">
                <td className="py-3 font-medium text-slate-800">{u.name}</td>
                <td className="py-3 text-slate-500">{u.email}</td>
                <td className="py-3 capitalize">{u.role}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggleStatus(u)} className="btn-outline px-3 py-1.5 text-xs">
                      {u.status === "active" ? "Suspend" : "Activate"}
                    </button>
                    <button onClick={() => remove(u)} className="px-3 py-1.5 text-xs font-semibold text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
