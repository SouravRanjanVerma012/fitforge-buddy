import { WorkoutTracker } from "@/components/WorkoutTracker";
import { ProgressChart } from "@/components/ProgressChart";
import { QuickActions } from "@/components/QuickActions";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Workout Tracker */}
        <div className="lg:col-span-2">
          <WorkoutTracker />
        </div>
        
        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <QuickActions />
          <ProgressChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
