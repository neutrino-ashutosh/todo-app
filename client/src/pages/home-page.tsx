import { useAuth } from "@/hooks/use-auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setView } from "@/store/todoSlice";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { LogOut, AlignJustify, Calendar, Star, List, Users } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const currentView = useSelector((state: RootState) => state.todos.currentView);

  const viewLabels = {
    all: "All Tasks",
    today: "Today",
    important: "Important",
    planned: "Planned",
    assigned: "Assigned to me"
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={user?.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=Felix"} 
              alt="Profile" 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="font-medium">Hey, {user?.username || 'User'}</h2>
            </div>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'all' ? 'bg-green-50 text-green-700' : ''}`}
                onClick={() => dispatch(setView('all'))}
              >
                <AlignJustify className="mr-2 h-4 w-4" />
                All Tasks
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'today' ? 'bg-green-50 text-green-700' : ''}`}
                onClick={() => dispatch(setView('today'))}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Today
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'important' ? 'bg-green-50 text-green-700' : ''}`}
                onClick={() => dispatch(setView('important'))}
              >
                <Star className="mr-2 h-4 w-4" />
                Important
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'planned' ? 'bg-green-50 text-green-700' : ''}`}
                onClick={() => dispatch(setView('planned'))}
              >
                <List className="mr-2 h-4 w-4" />
                Planned
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${currentView === 'assigned' ? 'bg-green-50 text-green-700' : ''}`}
                onClick={() => dispatch(setView('assigned'))}
              >
                <Users className="mr-2 h-4 w-4" />
                Assigned to me
              </Button>
            </li>
          </ul>
        </nav>

        <div className="border-t pt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => logoutMutation.mutate()}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
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
              <h2 className="text-lg font-semibold">{viewLabels[currentView]} Tasks</h2>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">11</div>
              </div>
            </div>
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  );
}