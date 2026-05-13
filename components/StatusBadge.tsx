export default function StatusBadge({
  status,
}) {
  const statusColors = {
    new: 'bg-blue-100 text-blue-700',

    in_progress:
      'bg-orange-100 text-orange-700',

    completed:
      'bg-green-100 text-green-700',

    waiting:
      'bg-yellow-100 text-yellow-700',

    cancelled:
      'bg-gray-100 text-gray-700',
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        statusColors[status] ||
        statusColors.new
      }`}
    >
      {status}
    </span>
  )
}