"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, Download, Share2, BarChart3, LineChart } from "lucide-react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { cn } from "@/lib/utils";

const metricsData = {
  today: [
    { label: "Today's Revenue", value: "$7,056", change: 12.5, trend: "up" as const },
    { label: "Transactions", value: "138", change: 8.3, trend: "up" as const },
    { label: "Avg Transaction", value: "$51.16", change: 3.2, trend: "up" as const },
    { label: "Tips Collected", value: "$423", change: 15.7, trend: "up" as const }
  ],
  week: [
    { label: "Week's Revenue", value: "$19,470", change: 7.2, trend: "up" as const },
    { label: "Transactions", value: "412", change: 5.8, trend: "up" as const },
    { label: "Avg Transaction", value: "$47.26", change: -2.1, trend: "down" as const },
    { label: "Tips Collected", value: "$1,847", change: 9.3, trend: "up" as const }
  ],
  month: [
    { label: "Month's Revenue", value: "$83,355", change: 14.6, trend: "up" as const },
    { label: "Transactions", value: "1,764", change: 11.2, trend: "up" as const },
    { label: "Avg Transaction", value: "$47.25", change: -0.8, trend: "down" as const },
    { label: "Tips Collected", value: "$7,892", change: 18.4, trend: "up" as const }
  ],
  all: [
    { label: "Total Revenue", value: "$451,234", change: 23.7, trend: "up" as const },
    { label: "Total Transactions", value: "9,432", change: 18.9, trend: "up" as const },
    { label: "Avg Transaction", value: "$47.83", change: 1.2, trend: "up" as const },
    { label: "Total Tips", value: "$42,567", change: 26.3, trend: "up" as const }
  ]
};

const revenueData = {
  today: [
    { hour: "9AM", revenue: 145 },
    { hour: "10AM", revenue: 289 },
    { hour: "11AM", revenue: 425 },
    { hour: "12PM", revenue: 687 },
    { hour: "1PM", revenue: 892 },
    { hour: "2PM", revenue: 645 },
    { hour: "3PM", revenue: 489 },
    { hour: "4PM", revenue: 356 },
    { hour: "5PM", revenue: 578 },
    { hour: "6PM", revenue: 823 },
    { hour: "7PM", revenue: 945 },
    { hour: "8PM", revenue: 782 }
  ],
  week: [
    { day: "Mon", revenue: 2145 },
    { day: "Tue", revenue: 1856 },
    { day: "Wed", revenue: 2489 },
    { day: "Thu", revenue: 2687 },
    { day: "Fri", revenue: 3192 },
    { day: "Sat", revenue: 3845 },
    { day: "Sun", revenue: 3256 }
  ],
  month: [
    { week: "Week 1", revenue: 18456 },
    { week: "Week 2", revenue: 21345 },
    { week: "Week 3", revenue: 19876 },
    { week: "Week 4", revenue: 23678 }
  ],
  all: [
    { month: "Jan", revenue: 68234 },
    { month: "Feb", revenue: 72456 },
    { month: "Mar", revenue: 81234 },
    { month: "Apr", revenue: 76543 },
    { month: "May", revenue: 83355 },
    { month: "Jun", revenue: 89432 }
  ]
};

const topProducts = [
  { name: "Signature Burger", quantity: 87, revenue: 1305 },
  { name: "Caesar Salad", quantity: 64, revenue: 832 },
  { name: "Fish Tacos", quantity: 52, revenue: 728 },
  { name: "Veggie Bowl", quantity: 43, revenue: 645 },
  { name: "Classic Pizza", quantity: 38, revenue: 608 }
];

const peakHours = [
  { hour: "11 AM", sales: 45 },
  { hour: "12 PM", sales: 89 },
  { hour: "1 PM", sales: 95 },
  { hour: "2 PM", sales: 72 },
  { hour: "3 PM", sales: 48 },
  { hour: "4 PM", sales: 35 },
  { hour: "5 PM", sales: 56 },
  { hour: "6 PM", sales: 82 },
  { hour: "7 PM", sales: 91 }
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "all">("week");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const getCurrentData = () => {
    return revenueData[timeRange];
  };

  const getMaxRevenue = () => {
    const data = getCurrentData();
    return Math.max(...data.map((item: any) => item.revenue));
  };

  const getMinRevenue = () => {
    const data = getCurrentData();
    return Math.min(...data.map((item: any) => item.revenue));
  };

  return (
    <div className="min-h-full">
      <MobileHeader title="Analytics" />

      {/* Desktop header */}
      <header className="hidden md:block border-b border-gray-800 bg-gray-950/50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-2">Analytics</h1>
              <p className="text-gray-400 mt-1">Track your business performance</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary !px-4 !py-2">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button className="btn-secondary !px-4 !py-2">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20 md:pb-8 md:pt-6">
        <div className="container space-y-6">
          {/* Time Range Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["today", "week", "month", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize",
                  timeRange === range
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {metricsData[timeRange].map((metric, index) => (
              <div key={index} className="card p-4">
                <p className="text-sm text-gray-400">{metric.label}</p>
                <p className="text-xl font-semibold text-white mt-1">{metric.value}</p>
                <div className={cn(
                  "flex items-center text-xs mt-2",
                  metric.trend === "up" ? "text-green-400" : "text-red-400"
                )}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-medium text-white">Revenue Trend</h3>
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setChartType("line")}
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded transition-colors",
                    chartType === "line"
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <LineChart className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded transition-colors",
                    chartType === "bar"
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 pl-16 relative">
              {chartType === "bar" ? (
                <div className="relative">
                  {/* Y-axis labels */}
                  <div className="absolute -left-12 top-0 h-40 flex flex-col justify-between text-xs text-gray-500">
                    <span>${Math.round(getMaxRevenue()).toLocaleString()}</span>
                    <span>${Math.round((getMaxRevenue() + getMinRevenue()) / 2).toLocaleString()}</span>
                    <span>${Math.round(getMinRevenue()).toLocaleString()}</span>
                  </div>

                  <div className="h-40 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      {[0, 25, 50, 75, 100].map((y) => (
                        <div
                          key={y}
                          className="absolute w-full border-t border-gray-800"
                          style={{ bottom: `${y}%` }}
                        />
                      ))}
                    </div>

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-between gap-1">
                      {getCurrentData().map((item: any, index: number) => {
                        const height = (item.revenue / getMaxRevenue()) * 100;
                        return (
                          <div key={index} className="flex-1 group relative flex flex-col items-center">
                            <div className="w-full h-40 flex items-end">
                              <div
                                className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80"
                                style={{ height: `${height}%` }}
                              >
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 shadow-xl text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                  <div className="font-semibold">${item.revenue.toLocaleString()}</div>
                                  <div className="text-gray-400 mt-0.5">
                                    {item.hour || item.day || item.week || item.month}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs text-center mt-2 text-gray-500 ${
                              (timeRange === 'today' && index % 2 === 1) ? 'hidden md:block' : ''
                            }`}>
                              {item.hour || item.day || item.week || item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Y-axis labels */}
                  <div className="absolute -left-12 top-0 h-40 flex flex-col justify-between text-xs text-gray-500">
                    <span>${Math.round(getMaxRevenue()).toLocaleString()}</span>
                    <span>${Math.round((getMaxRevenue() + getMinRevenue()) / 2).toLocaleString()}</span>
                    <span>${Math.round(getMinRevenue()).toLocaleString()}</span>
                  </div>

                  <div className="h-40 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      {[0, 25, 50, 75, 100].map((y) => (
                        <div
                          key={y}
                          className="absolute w-full border-t border-gray-800"
                          style={{ bottom: `${y}%` }}
                        />
                      ))}
                    </div>

                    {/* SVG Line Chart */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(37, 99, 235)" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {(() => {
                        const data = getCurrentData();
                        const points = data.map((item: any, index: number) => {
                          const columnWidth = 100 / data.length;
                          const x = (index * columnWidth) + (columnWidth / 2);
                          const normalizedValue = (item.revenue - getMinRevenue()) / (getMaxRevenue() - getMinRevenue());
                          const y = 95 - (normalizedValue * 85);
                          return { x, y };
                        });

                        const extendedPoints = [
                          { x: 0, y: points[0].y },
                          ...points,
                          { x: 100, y: points[points.length - 1].y }
                        ];

                        const linePath = extendedPoints
                          .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
                          .join(' ');

                        const areaPath = `${linePath} L 100 100 L 0 100 Z`;

                        return (
                          <g>
                            <path d={areaPath} fill="url(#areaGradient)" />
                            <path
                              d={linePath}
                              fill="none"
                              stroke="rgb(37, 99, 235)"
                              strokeWidth="2"
                              vectorEffect="non-scaling-stroke"
                            />
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    {getCurrentData().map((item: any, index: number) => (
                      <span
                        key={index}
                        className={`flex-1 text-center ${
                          (timeRange === 'today' && index % 2 === 1) ? 'hidden md:block' : ''
                        }`}
                      >
                        {item.hour || item.day || item.week || item.month}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-medium text-white">Top Products</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {topProducts.map((product, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-white">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.quantity} sold</p>
                  </div>
                  <p className="font-semibold text-white">${product.revenue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-medium text-white">Peak Hours</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {peakHours.map((hour, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-12">{hour.hour}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${hour.sales}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white w-8">{hour.sales}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-medium text-white">Payment Methods</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Credit Card</span>
                <span className="text-sm font-medium text-white">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Cash</span>
                <span className="text-sm font-medium text-white">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Digital Wallet</span>
                <span className="text-sm font-medium text-white">10%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
