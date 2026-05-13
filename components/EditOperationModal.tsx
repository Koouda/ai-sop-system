"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function EditOperationModal({
  open,
  onOpenChange,
  operation,
  onUpdated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("new");
  const [priority, setPriority] = useState("medium");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (operation) {
      setTitle(operation.title || "");
      setDescription(operation.description || "");
      setStatus(operation.status || "new");
      setPriority(operation.priority || "medium");
    }
  }, [operation]);

  async function handleUpdate() {
    if (!operation?.id) return;

    setSaving(true);

    const { error } = await supabase
      .from("operations")
      .update({
        title,
        description,
        status,
        priority,
      })
      .eq("id", operation.id);

    if (error) {
      console.error(error);
      alert("Failed to update operation");
      setSaving(false);
      return;
    }

    if (onUpdated) {
      await onUpdated();
    }

    setSaving(false);
    onOpenChange(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Edit Operation
          </h2>

          <button
            onClick={() => onOpenChange(false)}
            className="text-2xl text-gray-400 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Operation title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full rounded-xl border px-4 py-3"
            rows={4}
            placeholder="Operation description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full rounded-xl border px-4 py-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting">Waiting</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="w-full rounded-xl border px-4 py-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}