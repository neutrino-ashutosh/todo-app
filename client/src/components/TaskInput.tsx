import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addTask } from "@/store/todoSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TaskInput() {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isOutdoor, setIsOutdoor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await dispatch(addTask({ title, priority, isOutdoor }));
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit">Add Task</Button>
      </div>
      
      <div className="flex items-center gap-4">
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Switch
            id="outdoor"
            checked={isOutdoor}
            onCheckedChange={setIsOutdoor}
          />
          <Label htmlFor="outdoor">Outdoor Activity</Label>
        </div>
      </div>
    </form>
  );
}
