// ✅ /app/dashboard/coach/components/ExportCSVButton.tsx
'use client';

import { Button } from "@/app/components/ui/button";
import { Download } from "lucide-react";

interface ExportCSVButtonProps {
  currentFilters: {
    search?: string;
    status?: string;
    batchId?: string;
    zone?: string;
  };
}

export default function ExportCSVButton({ currentFilters }: ExportCSVButtonProps) {
  const handleExport = () => {
    const params = new URLSearchParams();

    if (currentFilters.search) {
      params.set('q', currentFilters.search);
    }
    if (currentFilters.status && currentFilters.status !== 'all') {
      params.set('status', currentFilters.status);
    }
    if (currentFilters.batchId && currentFilters.batchId !== 'all') {
      params.set('batchId', currentFilters.batchId);
    }
    if (currentFilters.zone && currentFilters.zone !== 'all') {
      params.set('zone', currentFilters.zone);
    }

    const url = `/api/export/coach${params.toString() ? `?${params.toString()}` : ''}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleExport}
    >
      <Download className="h-4 w-4" />

    </Button>
  );
}