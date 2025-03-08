import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { toggleTask, toggleImportant, deleteTask } from "@/store/todoSlice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import WeatherInfo from "./WeatherInfo";
import { Calendar, Star, Trash2 } from "lucide-react";
import { format, isToday } from "date-fns";

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, currentView } = useSelector((state: RootState) => state.todos);

  // Filter tasks based on current view
  const filteredTasks = tasks.filter(task => {
    switch (currentView) {
      case 'today':
        return task.dueDate ? isToday(new Date(task.dueDate)) : false;
      case 'important':
        return task.important;
      case 'planned':
        return task.dueDate !== null;
      case 'assigned':
        return true; // In this demo, all tasks are assigned to the user
      default:
        return true; // 'all' view shows all tasks
    }
  });

  // Group tasks by completion status
  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No tasks yet. Add some tasks to get started!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => dispatch(toggleTask(task.id))}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">
                  {task.title}
                </h3>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(task.dueDate), "PP")}</span>
                    </div>
                  )}
                  {task.isOutdoor && task.city && <WeatherInfo task={task} />}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(toggleImportant(task.id))}
                  className={`text-muted-foreground ${task.important ? 'text-yellow-500 hover:text-yellow-600' : 'hover:text-yellow-500'}`}
                >
                  <Star className="h-4 w-4" fill={task.important ? "currentColor" : "none"} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(deleteTask(task.id))}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Completed</h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => dispatch(toggleTask(task.id))}
                  />
                  <span className="flex-1 line-through text-muted-foreground">
                    {task.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dispatch(deleteTask(task.id))}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}