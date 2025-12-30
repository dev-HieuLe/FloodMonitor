import { Siren } from "lucide-react";

export default function SosRequestsCard() {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Siren size={18} className="text-red-600" />
        <h3 className="font-semibold text-gray-800">SOS Requests</h3>
      </div>

      {/* Total */}
      <div className="text-center mb-5">
        <div className="text-4xl font-bold text-gray-900">100</div>
        <div className="text-sm text-gray-500 mt-1">Total Requests</div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg py-3 text-center">
          <div className="text-lg font-semibold text-green-700">23</div>
          <div className="text-sm text-green-600">Verified</div>
        </div>

        <div className="bg-yellow-50 rounded-lg py-3 text-center">
          <div className="text-lg font-semibold text-yellow-700">44</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
      </div>
    </div>
  );
}
