export default function RoadConditionCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <div className="text-sm text-gray-500 mb-2">Road Conditions</div>
      <div className="flex gap-6">
        <div>
          <div className="text-2xl font-bold text-orange-500">249</div>
          <div className="text-xs text-gray-500">Incidents</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-xs text-gray-500">Blocked</div>
        </div>
      </div>
    </div>
  );
}
