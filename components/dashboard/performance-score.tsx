"use client";

import React from "react";

interface PerformanceScoreProps {
  score: number;
  target: number;
}

export function PerformanceScore({ score, target }: PerformanceScoreProps) {
  const percentage = Math.min((score / target) * 100, 100);
  const strokeDasharray = `${percentage} ${100 - percentage}`;

  return (
    <div className="dashboard-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Daily Performance
      </h3>
      <div className="relative w-32 h-32 mx-auto">
        <svg
          className="transform -rotate-90"
          width="128"
          height="128"
          viewBox="0 0 128 128"
        >
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="25"
            className="text-primary transition-all duration-500"
            style={{
              strokeDasharray: `${percentage * 3.52} 352`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold">{Math.round(percentage)}%</p>
            <p className="text-xs text-muted-foreground">of target</p>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm">
          ${score.toLocaleString()} / ${target.toLocaleString()}
        </p>
      </div>
    </div>
  );
}