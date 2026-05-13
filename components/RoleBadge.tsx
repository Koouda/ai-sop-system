export default function RoleBadge({ role }) {
  const color =
    role === "admin"
      ? "bg-red-100 text-red-700"
      : role === "analyst"
      ? "bg-blue-100 text-blue-700"
      : role === "operator"
      ? "bg-green-100 text-green-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>
      {role || "viewer"}
    </span>
  );
}