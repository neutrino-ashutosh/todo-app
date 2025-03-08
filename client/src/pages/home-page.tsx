import { useAuth } from "@/hooks/use-auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setView } from "@/store/todoSlice";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { LogOut, AlignJustify, Calendar, Star, List, Users, Plus, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, currentView } = useSelector((state: RootState) => state.todos);
  const { theme, setTheme } = useTheme();

  const viewLabels = {
    all: "All Tasks",
    today: "Today",
    important: "Important",
    planned: "Planned",
    assigned: "Assigned to me"
  };

  // Calculate task completion stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  // Selected task state
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={user?.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=Felix"} 
              alt="Profile" 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="font-medium dark:text-white">Hey, {user?.username || 'User'}</h2>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={() => {
              logoutMutation.mutate(undefined, {
                onSuccess: () => {
                  // Clear any stored auth state
                  localStorage.removeItem('user');
                  sessionStorage.removeItem('user');
                  
                  // Add a small delay before redirect to ensure logout is processed
                  setTimeout(() => {
                    window.location.href = '/auth';
                  }, 100);
                }
              });
            }}
          >
            Logout
          </Button>
        </div>

        <nav className="mt-8 flex-1">
          <ul className="space-y-2">
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'all' ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
                onClick={() => dispatch(setView('all'))}
              >
                <List className="mr-2 h-4 w-4" />
                All Tasks
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'today' ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
                onClick={() => dispatch(setView('today'))}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Today
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'important' ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
                onClick={() => dispatch(setView('important'))}
              >
                <Star className="mr-2 h-4 w-4" />
                Important
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'planned' ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
                onClick={() => dispatch(setView('planned'))}
              >
                <AlignJustify className="mr-2 h-4 w-4" />
                Planned
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'assigned' ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
                onClick={() => dispatch(setView('assigned'))}
              >
                <Users className="mr-2 h-4 w-4" />
                Assigned to me
              </Button>
            </li>
          </ul>

          <div className="mt-8">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add list
            </Button>
          </div>
        </nav>

        {/* Task Progress Circle */}
        <div className="mt-auto pt-8 space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-green-500"
                strokeWidth="3"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-medium dark:text-white">
                {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <TaskInput />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold dark:text-white">{viewLabels[currentView]}</h2>
              <div className="text-sm text-muted-foreground dark:text-gray-400">{totalTasks} tasks</div>
            </div>
            <TaskList onSelectTask={setSelectedTaskId} />
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      {selectedTaskId && (
        <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium dark:text-white">Task Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTaskId(null)}>×</Button>
            </div>
            <div className="space-y-4">
              <Button variant="ghost" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Add Due Date
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <AlignJustify className="mr-2 h-4 w-4" />
                Set Reminder
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <List className="mr-2 h-4 w-4" />
                Repeat
              </Button>
            </div>
            <div className="pt-4 border-t dark:border-gray-700">
              <textarea
                placeholder="Add Notes"
                className="w-full h-32 px-3 py-2 bg-transparent border rounded-md dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}