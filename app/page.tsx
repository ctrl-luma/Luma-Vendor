import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    name: 'Total Orders',
    value: '1,234',
    change: '+15.3%',
    trend: 'up',
    icon: ShoppingBag,
  },
  {
    name: 'Active Customers',
    value: '573',
    change: '-5.4%',
    trend: 'down',
    icon: Users,
  },
  {
    name: 'Conversion Rate',
    value: '3.24%',
    change: '+4.5%',
    trend: 'up',
    icon: TrendingUp,
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back! Here's an overview of your store's performance.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="dashboard-card">
            <div className="dashboard-stat">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  stat.trend === 'up' 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                )}>
                  {stat.change}
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="ml-0.5 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="ml-0.5 h-3 w-3" />
                  )}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="dashboard-card p-6">
          <h3 className="text-lg font-medium">Recent Orders</h3>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">No recent orders to display.</p>
          </div>
        </div>
        
        <div className="dashboard-card p-6">
          <h3 className="text-lg font-medium">Top Products</h3>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">No products to display.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}