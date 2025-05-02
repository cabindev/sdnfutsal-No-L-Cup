// components/ExportCSVDropdown.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"

interface TrainingBatch {
  id: number
  batchNumber: number
  year: number
  isActive: boolean
}

interface ExportCSVDropdownProps {
  batches: TrainingBatch[]
}

export default function ExportCSVDropdown({ batches }: ExportCSVDropdownProps) {
  const handleExport = (batchId: string | null) => {
    // ส่ง request ไปยัง API endpoint เพื่อดาวน์โหลด CSV
    const url = batchId 
      ? `/api/export/coach?batchId=${batchId}` 
      : '/api/export/coach'
      
    window.open(url, '_blank')
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Save CSV</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport(null)}>
          ทุกรุ่น
        </DropdownMenuItem>
        {batches.map((batch) => (
          <DropdownMenuItem key={batch.id} onClick={() => handleExport(batch.id.toString())}>
            รุ่นที่ {batch.batchNumber}/{batch.year}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}