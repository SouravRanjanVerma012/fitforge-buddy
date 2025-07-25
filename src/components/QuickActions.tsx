import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dumbbell, 
  Timer, 
  Camera, 
  Heart, 
  BarChart3, 
  Settings,
  Play,
  Pause
} from "lucide-react";
import { useState } from "react";

export const QuickActions = () => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 minutes rest

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Quick Actions</h3>
        
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="fitness" size="lg" className="h-20 flex-col">
            <Dumbbell className="h-6 w-6 mb-2" />
            Start Workout
          </Button>
          <Button variant="accent" size="lg" className="h-20 flex-col">
            <Camera className="h-6 w-6 mb-2" />
            Form Check
          </Button>
        </div>

        {/* Rest Timer */}
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Rest Timer</p>
                <p className="text-2xl font-bold font-mono">{formatTime(timerSeconds)}</p>
              </div>
            </div>
            <Button
              variant={isTimerActive ? "outline" : "default"}
              size="icon"
              onClick={() => setIsTimerActive(!isTimerActive)}
            >
              {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </Card>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-16 flex-col">
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs">Health Sync</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Analytics</span>
          </Button>
        </div>

        {/* Settings */}
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          Workout Settings
        </Button>
      </div>
    </Card>
  );
};