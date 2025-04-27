// app/dashboard/loading.tsx
import SectionLoader from "../components/ui/SectionLoader";

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <SectionLoader variant="progress" size="sm" showText={false} />
    </div>
  );
}
