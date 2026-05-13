export default function PriorityBadge({ priority }) {
  const value = priority?.toLowerCase() || 'medium'

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        priorityColors[value] || priorityColors.medium
      }`}
    >
      {value}
    </span>
  )
}