"use client";

import React, { useState } from "react";
import { TrendingUp, DollarSign, ShoppingCart, Users, Download, Share2, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Metric {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-gray-950/85 border-b border-gray-200 dark:border-gray-800 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-semibold">Analytics</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pb-20 md:pb-8 md:pt-8">
        <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-8">
        <div className="px-4 py-4">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <Button
              variant={timeRange === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("today")}
            >
              Today
            </Button>
            <Button
              variant={timeRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("week")}
            >
              Week
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("month")}
            >
              Month
            </Button>
            <Button
              variant={timeRange === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("all")}
            >
              All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {metricsData[timeRange].map((metric, index) => (
              <div key={index} className="dashboard-card p-4">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-xl font-semibold mt-1">{metric.value}</p>
                <div className={`flex items-center text-xs mt-2 ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  {metric.change}%
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-card mb-6">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">Revenue Trend</h3>
              <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                <Button
                  size="sm"
                  variant={chartType === "line" ? "default" : "ghost"}
                  className="h-7 w-7 p-0"
                  onClick={() => setChartType("line")}
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={chartType === "bar" ? "default" : "ghost"}
                  className="h-7 w-7 p-0"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 pl-16 relative">
              {chartType === "bar" ? (
                <div className="relative">
                  {/* Y-axis labels */}
                  <div className="absolute -left-12 top-0 h-40 flex flex-col justify-between text-xs text-muted-foreground">
                    <span>${Math.round(getMaxRevenue()).toLocaleString()}</span>
                    <span>${Math.round((getMaxRevenue() + getMinRevenue()) / 2).toLocaleString()}</span>
                    <span>${Math.round(getMinRevenue()).toLocaleString()}</span>
                  </div>
                  
                  <div className="h-40 relative">
                    {/* Grid lines background */}
                    <div className="absolute inset-0">
                      {[0, 25, 50, 75, 100].map((y) => (
                        <div
                          key={y}
                          className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                          style={{ bottom: `${y}%` }}
                        />
                      ))}
                    </div>
                    
                    <div className="absolute inset-0 flex items-end justify-between gap-1">
                    {getCurrentData().map((item: any, index: number) => {
                      const height = (item.revenue / getMaxRevenue()) * 100;
                      return (
                        <div key={index} className="flex-1 group relative flex flex-col items-center">
                          <div className="w-full h-40 flex items-end">
                            <div 
                              className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80 relative overflow-visible"
                              style={{ 
                                height: `${height}%`,
                                animation: `barGrow 0.6s ease-out ${index * 50}ms both`
                              }}
                            >
                              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card border border-border shadow-xl text-card-foreground text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                <div className="font-semibold">${item.revenue.toLocaleString()}</div>
                                <div className="text-muted-foreground mt-0.5">
                                  {item.hour || item.day || item.week || item.month}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs text-center mt-2 text-muted-foreground ${
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
                  <div className="absolute -left-12 top-0 h-40 flex flex-col justify-between text-xs text-muted-foreground">
                    <span>${Math.round(getMaxRevenue()).toLocaleString()}</span>
                    <span>${Math.round((getMaxRevenue() + getMinRevenue()) / 2).toLocaleString()}</span>
                    <span>${Math.round(getMinRevenue()).toLocaleString()}</span>
                  </div>
                  
                  <div className="h-40 relative">
                    {/* Grid lines background */}
                    <div className="absolute inset-0">
                      {[0, 25, 50, 75, 100].map((y) => (
                        <div
                          key={y}
                          className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                          style={{ bottom: `${y}%` }}
                        />
                      ))}
                    </div>
                    
                    {/* SVG for line chart */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(96, 165, 250)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(96, 165, 250)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(96, 165, 250)" />
                          <stop offset="100%" stopColor="rgb(96, 165, 250)" />
                        </linearGradient>
                        <mask id="lineMask">
                          <rect x="0" y="0" width="0" height="100" fill="white">
                            <animate attributeName="width" from="0" to="100" dur="1.5s" fill="freeze" />
                          </rect>
                        </mask>
                      </defs>
                      
                      {(() => {
                        const data = getCurrentData();
                        
                        const points = data.map((item: any, index: number) => {
                          // Center each point in its column, like the bar chart
                          const columnWidth = 100 / data.length;
                          const x = (index * columnWidth) + (columnWidth / 2);
                          const normalizedValue = (item.revenue - getMinRevenue()) / (getMaxRevenue() - getMinRevenue());
                          const y = 95 - (normalizedValue * 85); // Invert and scale to use most of the height
                          return { x, y };
                        });
                        
                        // Extend the line to the edges
                        const firstPoint = points[0];
                        const lastPoint = points[points.length - 1];
                        const extendedPoints = [
                          { x: 0, y: firstPoint.y }, // Extend to left edge
                          ...points,
                          { x: 100, y: lastPoint.y } // Extend to right edge
                        ];
                        
                        const linePath = extendedPoints
                          .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
                          .join(' ');
                        
                        const areaPath = `${linePath} L 100 100 L 0 100 Z`;
                        
                        return (
                          <g>
                            {/* Area fill */}
                            <path
                              d={areaPath}
                              fill="url(#areaGradient)"
                              opacity="0"
                            >
                              <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.5s" fill="freeze" />
                            </path>
                            
                            {/* Line */}
                            <path
                              d={linePath}
                              fill="none"
                              stroke="url(#lineGradient)"
                              strokeWidth="2"
                              vectorEffect="non-scaling-stroke"
                              mask="url(#lineMask)"
                            />
                          </g>
                        );
                      })()}
                    </svg>
                    
                    {/* Interactive hover areas with HTML tooltips */}
                    <div className="absolute inset-0 flex">
                      {getCurrentData().map((item: any, index: number) => {
                        const data = getCurrentData();
                        const normalizedValue = (item.revenue - getMinRevenue()) / (getMaxRevenue() - getMinRevenue());
                        const yPercent = 5 + (normalizedValue * 85); // Match the SVG calculation but inverted for CSS
                        
                        return (
                          <div
                            key={index}
                            className="relative flex-1 group h-full"
                          >
                            {/* Hover area */}
                            <div className="absolute inset-0 cursor-pointer" />
                            
                            {/* Tooltip positioned at the data point */}
                            <div 
                              className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 pointer-events-none"
                              style={{
                                left: '50%',
                                bottom: `${yPercent}%`,
                                transform: 'translate(-50%, -12px)'
                              }}
                            >
                              <div className="bg-card border border-border shadow-xl text-card-foreground text-xs px-3 py-2 rounded-md whitespace-nowrap">
                                <div className="font-semibold">${item.revenue.toLocaleString()}</div>
                                <div className="text-muted-foreground mt-0.5">
                                  {item.hour || item.day || item.week || item.month}
                                </div>
                              </div>
                            </div>
                            
                            {/* Visual indicator on hover */}
                            <div 
                              className="absolute w-0.5 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              style={{
                                left: '50%',
                                top: 0,
                                bottom: 0,
                                transform: 'translateX(-50%)'
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
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

          <div className="dashboard-card mb-6">
            <div className="p-4 border-b">
              <h3 className="font-medium">Top Products</h3>
            </div>
            <div className="divide-y">
              {topProducts.map((product, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.quantity} sold</p>
                  </div>
                  <p className="font-semibold">${product.revenue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card mb-6">
            <div className="p-4 border-b">
              <h3 className="font-medium">Peak Hours</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {peakHours.map((hour, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12">{hour.hour}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${hour.sales}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-8">{hour.sales}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="p-4 border-b">
              <h3 className="font-medium">Payment Methods</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Credit Card</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cash</span>
                <span className="text-sm font-medium">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Digital Wallet</span>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}