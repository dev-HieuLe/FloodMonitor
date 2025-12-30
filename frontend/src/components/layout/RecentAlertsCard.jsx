import { AlertTriangle } from "lucide-react";

const alerts = [
  { name: "M.R.F. Risna", date: "12/28/2025" },
  { name: "M. Mohamed Raisath", date: "12/26/2025" },
  { name: "Min Sathi", date: "12/24/2025" },
  { name: "Suthakaran Suganthy", date: "12/24/2025" },
];

export default function RecentAlertsCard() {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-yellow-500" />
          <h3 className="font-semibold text-gray-800">Recent Alerts</h3>
        </div>

        <span className="text-sm text-blue-600 cursor-pointer">All</span>
      </div>

      {/* List */}
      <ul className="space-y-4">
        {alerts.map((item, i) => (
          <li
            key={i}
            className="flex items-start justify-between border-b last:border-b-0 pb-3"
          >
            <div>
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-xs text-gray-500 mt-1">Unknown location</div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                PENDING
              </span>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
