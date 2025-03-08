import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchTasks, toggleTask, deleteTask } from "@/store/todoSlice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import WeatherInfo from "./WeatherInfo";
import { Calendar, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";

const priorityStyles = {
  low: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  medium: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  high: "bg-red-50 border-red-200 hover:bg-red-100",
};

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No tasks yet. Add some tasks to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`rounded-xl border p-4 transition-colors ${
            priorityStyles[task.priority as keyof typeof priorityStyles]
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => dispatch(toggleTask(task.id))}
                className="mt-1"
              />
              <div className="space-y-1">
                <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{task.dueDate ? format(new Date(task.dueDate), "PP") : "No due date"}</span>
                  </div>
                  {task.isOutdoor && <WeatherInfo task={task} />}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(deleteTask(task.id))}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}