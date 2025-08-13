// src/components/tasks/TaskForm.jsx
import { useEffect, useId, useState } from "react";
import { useToast } from "../../context/ToastContext";
// Stable default to avoid re-renders resetting the form
const EMPTY_TASK = Object.freeze({ title: "", description: "", status: "open" });

/**
 * Reusable TaskForm
 * Props:
 *  - initialValues?: { id? | _id?, title, description, status }
 *  - onSubmit: (payload) => Promise<any>    // createTask or updateTask
 *  - submitLabel?: string                   // "Add Task" | "Update Task"
 *  - onSuccess?: () => void                 // called after successful submit
 */
const TaskForm = ({
    initialValues = EMPTY_TASK,
    onSubmit,
    submitLabel = "Add Task",
    onSuccess,
}) => {
    const [title, setTitle] = useState(initialValues.title || "");
    const [description, setDescription] = useState(initialValues.description || "");
    const [status, setStatus] = useState(initialValues.status || "open");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const titleId = useId();
    const descId = useId();
    const statusId = useId();
    const { push } = useToast();

    // Detect edit mode based on presence of an id
    const isEdit = !!(initialValues?.id || initialValues?._id);
    const heading = isEdit ? "Edit Task" : "Create Task";

    // IMPORTANT: sync when the primitive field values change,
    // not when the object reference changes.
    useEffect(() => {
        setTitle(initialValues.title || "");
        setDescription(initialValues.description || "");
        setStatus(initialValues.status || "open");
    }, [initialValues.title, initialValues.description, initialValues.status]);

    const validate = () => {
        if (!title.trim()) {
            setError("Title is required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;

        try {
            setLoading(true);
            await onSubmit?.({
                title: title.trim(),
                description: description.trim(),
                status,
            });

            // For create, clear the form; for edit, keep values.
            if (!isEdit) {
                setTitle("");
                setDescription("");
                setStatus("open");
                push("Task Created", "success");
            } else {
                push("Task Updated", "success");
            }

            onSuccess?.();
        } catch (err) {
            setError(err?.message || "Failed to save task.");
            push("Failed to delete", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-xl bg-white/80">
            <h3 className="text-h5 font-semibold mb-3">{heading}</h3>

            {error && (
                <div className="mb-3 p-2 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <label htmlFor={titleId} className="block text-sm font-medium mb-1">
                Title <span className="text-red-600">*</span>
            </label>
            <input
                id={titleId}
                type="text"
                name="title"
                aria-invalid={!!error && !title.trim() ? "true" : "false"}
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                placeholder="e.g., Set up MongoDB Atlas"
            />

            <label htmlFor={descId} className="block text-sm font-medium mb-1 mt-3">
                Description
            </label>
            <textarea
                id={descId}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                placeholder="Optional details..."
            />

            <label htmlFor={statusId} className="block text-sm font-medium mb-1 mt-3">
                Status
            </label>
            <select
                id={statusId}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
            >
                <option value="Open">Open</option>
                <option value="In Progress">In progress</option>
                <option value="Done">Done</option>
            </select>

            <button
                type="submit"
                disabled={loading}
                aria-disabled={loading ? "true" : "false"}
                className="mt-3 inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60"
            >
                {loading ? "Saving…" : submitLabel}
            </button>
        </form>
    );
};

export default TaskForm;
