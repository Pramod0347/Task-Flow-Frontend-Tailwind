// src/components/tasks/TaskList.jsx
import { useState, useEffect, useCallback } from "react";
import { getTasks, deleteTask, updateTask } from "../../services/taskService";
import TaskForm from "./TaskForm";
import Modal from "../ui/Modal";
import StatusChip from "../ui/StatusChip";
import { useToast } from "../../context/ToastContext";


const TaskList = ({ refreshKey }) => {
    // ---------- state ----------
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [editingTask, setEditingTask] = useState(null); // null = not editing
    const { push } = useToast();


    // ---------- data fetcher (stable function) ----------
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTasks();
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    // Run on mount + whenever parent bumps refreshKey
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks, refreshKey]);

    // ---------- actions ----------
    const handleDelete = async (id) => {
        const ok = window.confirm("Delete this task?");
        if (!ok) return;

        try {
            setDeletingId(id);
            await deleteTask(id);
            // If you were editing this same task, close the modal
            if (editingTask && (editingTask._id || editingTask.id) === id) {
                setEditingTask(null);
            }
            push("Task Deleted", "success");
            await fetchTasks();
        } catch (err) {
            alert(err.message || "Failed to delete task");
        } finally {
            setDeletingId(null);
        }
    };

    const startEdit = (task) => setEditingTask(task);
    const closeEdit = () => setEditingTask(null);

    // ---------- tiny presentational sub-components ----------
    const EmptyState = () => (
        <div className="text-center py-10">
            <p className="text-body text-gray-600">No tasks yet.</p>
            <p className="text-sm text-gray-500">Create your first task to get started.</p>
        </div>
    );

    const LoadingSkeleton = () => (
        <ul className="space-y-2">
            {[...Array(4)].map((_, i) => (
                <li key={i} className="p-3 border rounded-lg animate-pulse">
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-1/3 bg-gray-200 rounded" />
                </li>
            ))}
        </ul>
    );

    const ErrorState = () => (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-red-700 font-medium">Error: {error}</p>
            <button
                type="button"
                onClick={fetchTasks}
                className="mt-3 inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
                Try again
            </button>
        </div>
    );

    // ---------- render ----------
    return (
        <section className="max-w-3xl">
            {/* Header row with Refresh */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-h4 font-semibold">Tasks</h3>
                <button
                    type="button"
                    onClick={fetchTasks}
                    className="inline-flex items-center rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand"
                >
                    <span className="text-gray-500">Refresh</span>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingSkeleton />
            ) : error ? (
                <ErrorState />
            ) : tasks.length === 0 ? (
                <EmptyState />
            ) : (
                <ul className="space-y-2">
                    {tasks.map((t) => {
                        const id = t._id || t.id; // Mongo uses _id; keep an alias for safety
                        return (
                            <li key={id} className="p-3 border rounded-lg hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-body font-medium">{t.title || t.name || "Untitled Task"}</p>
                                        {t.description && (
                                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                                {t.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <StatusChip value={t.status || "Open"} />

                                        <button
                                            type="button"
                                            onClick={() => startEdit(t)}
                                            className="text-xs rounded-lg border px-2 py-1 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(id)}
                                            disabled={deletingId === id}
                                            aria-label="Delete task"
                                            className="text-xs rounded-lg border px-2 py-1 hover:bg-gray-50 disabled:opacity-60"
                                        >
                                            {deletingId === id ? "Deleting…" : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Edit Modal */}
            <Modal isOpen={!!editingTask} onClose={closeEdit} title="Edit Task">
                {editingTask && (
                    <TaskForm
                        key={editingTask._id || editingTask.id} // remount when switching tasks
                        initialValues={{
                            id: editingTask._id || editingTask.id,
                            title: editingTask.title || editingTask.name || "",
                            description: editingTask.description || "",
                            status: editingTask.status || "open",
                        }}
                        submitLabel="Update Task"
                        onSubmit={(payload) => updateTask(editingTask._id || editingTask.id, payload)}
                        onSuccess={async () => {
                            closeEdit();
                            await fetchTasks();
                        }}
                    />
                )}
            </Modal>
        </section>
    );
};

export default TaskList;
