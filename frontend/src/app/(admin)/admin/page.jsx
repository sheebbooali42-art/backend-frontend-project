 "use client"

import React from "react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹8.4L",
    growth: "+24%",
    subtitle: "This Month",
    gradient: "from-purple-600 to-indigo-700",
  },
  {
    title: "Orders",
    value: "1,845",
    growth: "+12%",
    subtitle: "Weekly Growth",
    badge: "text-green-400 bg-green-500/20",
  },
  {
    title: "Customers",
    value: "12.5K",
    growth: "+35%",
    subtitle: "New Users",
    badge: "text-pink-400 bg-pink-500/20",
  },
  {
    title: "Products",
    value: "620",
    growth: "+8%",
    subtitle: "Inventory",
    badge: "text-yellow-400 bg-yellow-500/20",
  },
];

const activities = [
  {
    title: "New Order Received",
    description: "Order #1025 from Rahul Kumar",
    color: "bg-green-400",
  },
  {
    title: "Product Updated",
    description: "MacBook stock updated",
    color: "bg-blue-400",
  },
  {
    title: "Payment Failed",
    description: "Order #1044 payment declined",
    color: "bg-red-400",
  },
];

const orders = [
  {
    id: "#1001",
    customer: "Shibbu Ali",
    product: "MacBook Pro",
    amount: "₹1,25,000",
    status: "Delivered",
    statusClass: "bg-green-500/20 text-green-400",
  },
  {
    id: "#1002",
    customer: "Rahul Kumar",
    product: "AirPods Max",
    amount: "₹55,000",
    status: "Pending",
    statusClass: "bg-yellow-500/20 text-yellow-400",
  },
  {
    id: "#1003",
    customer: "Aman Singh",
    product: "Gaming Chair",
    amount: "₹18,000",
    status: "Cancelled",
    statusClass: "bg-red-500/20 text-red-400",
  },
];

const chartHeights = [
  "35%",
  "60%",
  "45%",
  "85%",
  "70%",
  "95%",
  "80%",
];

export default function UltraAdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white">
      <main className="p-4">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl border border-white/10 p-5 shadow-xl ${
                item.gradient
                  ? `bg-gradient-to-br ${item.gradient}`
                  : "bg-white/5 backdrop-blur-xl"
              }`}
            >
              {item.gradient && (
                <div className="absolute right-[-20px] top-[-20px] h-28 w-28 rounded-full bg-white/10" />
              )}

              <p className="text-xs text-gray-300">
                {item.title}
              </p>

              <h2 className="mt-3 text-3xl font-extrabold">
                {item.value}
              </h2>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    item.badge || "bg-white/20"
                  }`}
                >
                  {item.growth}
                </span>

                <span className="text-xs text-gray-300">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">

          <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Revenue Analytics
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Monthly business performance
                </p>
              </div>
              <select className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex h-[250px] items-end gap-3 rounded-3xl bg-[#111827] p-5">
              {chartHeights.map((height, index) => (
                <div
                  key={index}
                  style={{ height }}
                  className={`w-full rounded-t-xl ${
                    index === 5
                      ? "bg-green-400"
                      : "bg-cyan-400"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Live Activity
                </h2>

                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                  Live
                </span>
              </div>

              <div className="space-y-5">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3">

                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${activity.color}`}
                    />

                    <div>
                      <h3 className="text-sm font-semibold">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {activity.description}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

              <h2 className="text-lg font-bold">
                Sales Target
              </h2>

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Progress
                  </span>

                  <span className="text-xs font-semibold">
                    78%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[78%] rounded-full bg-green-400" />
                </div>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs text-gray-400">
                    Target
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    ₹10L
                  </h3>
                </div>

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs text-gray-400">
                    Achieved
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    ₹7.8L
                  </h3>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Orders */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Latest customer purchases
              </p>
            </div>

            <button className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10">
              View All
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-white/10 text-left text-gray-400">
                <tr>
                  <th className="pb-4 text-xs uppercase">
                    Order
                  </th>

                  <th className="pb-4 text-xs uppercase">
                    Customer
                  </th>

                  <th className="pb-4 text-xs uppercase">
                    Product
                  </th>

                  <th className="pb-4 text-xs uppercase">
                    Amount
                  </th>

                  <th className="pb-4 text-xs uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 text-sm font-semibold">
                      {order.id}
                    </td>

                    <td className="py-4 text-sm">
                      {order.customer}
                    </td>

                    <td className="py-4 text-sm">
                      {order.product}
                    </td>

                    <td className="py-4 text-sm">
                      {order.amount}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${order.statusClass}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </main>
    </div>
  );
}