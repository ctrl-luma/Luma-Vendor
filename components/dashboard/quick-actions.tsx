"use client";

import React from "react";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="p-4 space-y-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-900 md:rounded-xl md:mb-6">
      <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          size="lg"
          className="h-20 flex-col gap-2 bg-primary hover:bg-primary/90"
          onClick={() => {}}
        >
          <Plus className="h-6 w-6" />
          <span>New Sale</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => {}}
        >
          <ClipboardList className="h-6 w-6" />
          <span>Quick Order</span>
        </Button>
      </div>
    </div>
  );
}