import { useState } from "react";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import { createTask } from "../services/taskService";
import Modal from "../components/ui/Modal";

const Dashboard = () => {
    const [refreshTick, setRefreshTick] = useState(0);
    const refresh = () => setRefreshTick((t) => t + 1);
    const [isCreateOpen, setCreateOpen] = useState(false);

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-h3">Dashboard</h2>
                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    New Task
                </button>
            </div>
            <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} title="Create Task">
                <TaskForm
                    submitLabel="Add Task"
                    onSubmit={(payload) => createTask(payload)}
                    onSuccess={() => {
                        refresh();
                        setCreateOpen(false);
                    }}
                />
            </Modal>

            <TaskList refreshKey={refreshTick} />
        </div>
    );
}

export default Dashboard;