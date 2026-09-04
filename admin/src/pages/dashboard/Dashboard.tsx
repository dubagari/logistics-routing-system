import {
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

import { useAppDispatch, useAppSelector} from "../../redux/hooks";

import { fetchDashboardStats } from "../../redux/slices/dashboardSlice";
import { useEffect } from "react";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const { user, token } = useAppSelector(
    (state) => state.auth
  );

  const {
    stats: dashboardStats,
    loading,
    error,
  } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchDashboardStats(token));
    }
  }, [dispatch, token]);

  if (loading && !dashboardStats) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-sm text-slate-500">
        Loading dashboard...
      </div>
    </div>
  );
}

if (error && !dashboardStats) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
      {error}
    </div>
  );
}

  const stats = [
    {
      title: "Total Deliveries",
      value: dashboardStats?.total ?? 0,
      description: "all deliveries",
      icon: Package,
      change: "+0%",
    },
    {
      title: "Active Deliveries",
      value:
        (dashboardStats?.assigned ?? 0) +
        (dashboardStats?.accepted ?? 0) +
        (dashboardStats?.in_transit ?? 0),
      description: "currently active",
      icon: Truck,
      change: "+0%",
    },
    {
      title: "Delivered",
      value: dashboardStats?.delivered ?? 0,
      description: "successfully delivered",
      icon: MapPin,
      change: "+0%",
    },
    {
      title: "Cancelled",
      value: dashboardStats?.cancelled ?? 0,
      description: "cancelled deliveries",
      icon: ArrowDownRight,
      change: "+0%",
    },
  ];

  const recentDeliveries = [
    {
      id: "#DLV-001",
      customer: "No deliveries yet",
      pickup: "—",
      destination: "—",
      status: "Pending",
      statusStyle:
        "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Overview
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Here's what's happening with your logistics
              operations today.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
            <Clock3 size={17} />

            <span>Today</span>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={21} />
                </div>

                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight size={13} />
                  {stat.change}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Grid */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Delivery Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Delivery Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Delivery activity for the current period
              </p>
            </div>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Chart Placeholder */}
          <div className="mt-8 flex h-64 items-center justify-center rounded-xl bg-slate-50">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <Package size={25} />
              </div>

              <p className="mt-4 font-medium text-slate-600">
                No delivery data yet
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Delivery statistics will appear here
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-bold text-slate-900">
              Delivery Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current delivery distribution
            </p>
          </div>

         <div className="mt-8 space-y-6">
  <StatusRow
    label="Pending"
    value={dashboardStats?.pending ?? 0}
    total={dashboardStats?.total ?? 0}
    indicator="bg-amber-500"
  />

  <StatusRow
    label="In Transit"
    value={dashboardStats?.in_transit ?? 0}
    total={dashboardStats?.total ?? 0}
    indicator="bg-blue-500"
  />

  <StatusRow
    label="Delivered"
    value={dashboardStats?.delivered ?? 0}
    total={dashboardStats?.total ?? 0}
    indicator="bg-emerald-500"
  />

  <StatusRow
    label="Cancelled"
    value={dashboardStats?.cancelled ?? 0}
    total={dashboardStats?.total ?? 0}
    indicator="bg-red-500"
  />
</div>
        </div>
      </section>

      {/* Recent Deliveries */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Deliveries
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest delivery activity
            </p>
          </div>

          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Delivery
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pickup
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Destination
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentDeliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-5">
                    <span className="font-semibold text-slate-900">
                      {delivery.id}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {delivery.customer}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin
                        size={15}
                        className="text-slate-400"
                      />
                      {delivery.pickup}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin
                        size={15}
                        className="text-slate-400"
                      />
                      {delivery.destination}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${delivery.statusStyle}`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

interface StatusRowProps {
  label: string;
  value: number;
  total: number;
  indicator: string;
}

const StatusRow = ({
  label,
  value,
  total,
  indicator,
}: StatusRowProps) => {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${indicator}`}
          />

          <span className="text-sm font-medium text-slate-600">
            {label}
          </span>
        </div>

        <span className="text-sm font-semibold text-slate-900">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${indicator}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;