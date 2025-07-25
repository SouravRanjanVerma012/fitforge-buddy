import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Award } from "lucide-react";

export const ProgressChart = () => {
  // Mock data for demonstration
  const workoutData = [
    { date: "Mon", weight: 180, sets: 12 },
    { date: "Tue", weight: 185, sets: 15 },
    { date: "Wed", weight: 0, sets: 0 }, // Rest day
    { date: "Thu", weight: 190, sets: 14 },
    { date: "Fri", weight: 185, sets: 16 },
    { date: "Sat", weight: 195, sets: 12 },
    { date: "Sun", weight: 0, sets: 0 }, // Rest day
  ];

  const maxWeight = Math.max(...workoutData.map(d => d.weight));
  const maxSets = Math.max(...workoutData.map(d => d.sets));

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Progress
            </h3>
            <p className="text-muted-foreground">This week's performance</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            +15% vs last week
          </Badge>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {workoutData.map((day, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  {day.date}
                </div>
                <div className="relative h-24 bg-secondary rounded-lg overflow-hidden">
                  {day.weight > 0 && (
                    <>
                      {/* Weight bar */}
                      <div 
                        className="absolute bottom-0 w-full bg-gradient-primary rounded-lg transition-all duration-500"
                        style={{ height: `${(day.weight / maxWeight) * 80}%` }}
                      />
                      {/* Sets indicator */}
                      <div 
                        className="absolute bottom-0 w-full bg-accent/30 rounded-lg"
                        style={{ height: `${(day.sets / maxSets) * 100}%` }}
                      />
                    </>
                  )}
                  {day.weight === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  {day.weight > 0 ? (
                    <>
                      <div className="text-xs font-bold">{day.weight}lb</div>
                      <div className="text-xs text-muted-foreground">{day.sets} sets</div>
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground">Rest</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-xs text-muted-foreground">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">195</div>
            <div className="text-xs text-muted-foreground">Max Weight</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">69</div>
            <div className="text-xs text-muted-foreground">Total Sets</div>
          </div>
        </div>
      </div>
    </Card>
  );
};