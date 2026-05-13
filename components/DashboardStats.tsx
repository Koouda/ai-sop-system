export default function DashboardStats({ stats }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold">
        AI Operations Layer
      </h1>

      <p className="text-gray-500 mt-2 mb-5">
        Smart operational management system
      </p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-red-50 rounded-xl p-4">
          <p className="text-red-600 text-sm">High</p>
          <p className="text-3xl font-bold">{stats.high}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-blue-600 text-sm">In Progress</p>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-green-600 text-sm">Completed</p>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-orange-600 text-sm">Overdue</p>
          <p className="text-3xl font-bold">{stats.overdue}</p>
        </div>
      </div>
    </div>
  )
}