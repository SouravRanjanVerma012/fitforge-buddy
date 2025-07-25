import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Minus, Check, Timer, Weight, RotateCcw } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  targetSets: number;
}

interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export const WorkoutTracker = () => {
  const [isKg, setIsKg] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: "1",
    name: "Bench Press",
    targetSets: 4,
    sets: [
      { id: "1", weight: 185, reps: 8, completed: true },
      { id: "2", weight: 185, reps: 8, completed: true },
      { id: "3", weight: 190, reps: 6, completed: false },
      { id: "4", weight: 190, reps: 6, completed: false },
    ]
  });

  const completedSets = currentExercise.sets.filter(set => set.completed).length;
  const progress = (completedSets / currentExercise.targetSets) * 100;

  const convertWeight = (weight: number) => {
    return isKg ? Math.round(weight * 0.453592 * 10) / 10 : weight;
  };

  const getWeightIncrement = () => {
    return isKg ? 2.5 : 5;
  };

  const updateSet = (setId: string, field: 'weight' | 'reps', delta: number) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.map(set => 
        set.id === setId 
          ? { ...set, [field]: Math.max(0, set[field] + delta) }
          : set
      )
    }));
  };

  const toggleSetComplete = (setId: string) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.map(set => 
        set.id === setId 
          ? { ...set, completed: !set.completed }
          : set
      )
    }));
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-6">
        {/* Exercise Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{currentExercise.name}</h2>
            <p className="text-muted-foreground">
              {completedSets} of {currentExercise.targetSets} sets completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsKg(!isKg)}
              className="h-8"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              {isKg ? 'kg' : 'lbs'}
            </Button>
            <Badge variant="secondary" className="text-sm">
              <Timer className="h-4 w-4 mr-1" />
              12:34
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Sets */}
        <div className="space-y-3">
          {currentExercise.sets.map((set, index) => (
            <Card 
              key={set.id} 
              className={`p-4 transition-all ${set.completed ? 'bg-success/10 border-success/20' : 'border-border'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  
                  {/* Weight Control */}
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateSet(set.id, 'weight', -getWeightIncrement())}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      value={convertWeight(set.weight)}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        const convertedValue = isKg ? Math.round(value / 0.453592) : value;
                        setCurrentExercise(prev => ({
                          ...prev,
                          sets: prev.sets.map(s => 
                            s.id === set.id ? { ...s, weight: convertedValue } : s
                          )
                        }));
                      }}
                      className="w-16 text-center h-8"
                    />
                    <span className="text-sm text-muted-foreground">{isKg ? 'kg' : 'lbs'}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateSet(set.id, 'weight', getWeightIncrement())}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Reps Control */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateSet(set.id, 'reps', -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      value={set.reps}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setCurrentExercise(prev => ({
                          ...prev,
                          sets: prev.sets.map(s => 
                            s.id === set.id ? { ...s, reps: value } : s
                          )
                        }));
                      }}
                      className="w-16 text-center h-8"
                    />
                    <span className="text-sm text-muted-foreground">reps</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateSet(set.id, 'reps', 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Complete Button */}
                <Button
                  variant={set.completed ? "success" : "outline"}
                  onClick={() => toggleSetComplete(set.id)}
                  className="min-w-[100px]"
                >
                  {set.completed ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Done
                    </>
                  ) : (
                    "Complete"
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="accent" size="lg" className="flex-1">
            Add Set
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            Next Exercise
          </Button>
        </div>
      </div>
    </Card>
  );
};