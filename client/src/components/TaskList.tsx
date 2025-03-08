import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchTasks, toggleTask, deleteTask } from "@/store/todoSlice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import WeatherInfo from "./WeatherInfo";
import { Loader2, Trash2 } from "lucide-react";

const priorityColors = {
  low: "bg-blue-100 border-blue-200",
  medium: "bg-yellow-100 border-yellow-200",
  high: "bg-red-100 border-red-200",
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-2 p-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            priorityColors[task.priority as keyof typeof priorityColors]
          }`}
        >
          <div className="flex items-center gap-4">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => dispatch(toggleTask(task.id))}
            />
            <span className={task.completed ? "line-through" : ""}>
              {task.title}
            </span>
            {task.isOutdoor && <WeatherInfo task={task} />}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(deleteTask(task.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
