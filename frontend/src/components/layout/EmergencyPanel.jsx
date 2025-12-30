import {
  Droplet,
  HeartPulse,
  LifeBuoy,
  Package,
  Users,
  Construction,
  Phone,
} from "lucide-react";

export default function EmergencyPanel() {
  return (
    <div className="bg-white rounded-xl shadow h-full flex flex-col">
      {/* HEADER */}
      <div className="bg-red-600 text-white rounded-t-xl px-5 py-4">
        <div className="font-semibold text-base flex items-center gap-2">
          ⚠️ Report Emergency
        </div>
        <div className="text-xs opacity-90 mt-1">
          Select your emergency type below
        </div>
      </div>

      {/* GRID */}
      <div className="p-5 grid grid-cols-2 gap-4 text-sm flex-1">
        {/* Flood */}
        <EmergencyTile
          icon={<Droplet className="text-blue-500" size={20} />}
          title="Flood / Trapped"
          subtitle="Water rising, need rescue"
          bg="bg-blue-50"
          border="border-blue-200"
        />

        {/* Medical */}
        <EmergencyTile
          icon={<HeartPulse className="text-red-500" size={20} />}
          title="Medical"
          subtitle="Health emergency"
          bg="bg-red-50"
          border="border-red-200"
        />

        {/* Rescue */}
        <EmergencyTile
          icon={<LifeBuoy className="text-orange-500" size={20} />}
          title="Rescue"
          subtitle="Immediate rescue needed"
          bg="bg-orange-50"
          border="border-orange-200"
        />

        {/* Supplies */}
        <EmergencyTile
          icon={<Package className="text-green-600" size={20} />}
          title="Supplies"
          subtitle="Food, water, essentials"
          bg="bg-green-50"
          border="border-green-200"
        />

        {/* Missing */}
        <EmergencyTile
          icon={<Users className="text-purple-500" size={20} />}
          title="Missing Person"
          subtitle="Report missing person"
          bg="bg-purple-50"
          border="border-purple-200"
        />

        {/* Road */}
        <EmergencyTile
          icon={<Construction className="text-gray-600" size={20} />}
          title="Road Damage"
          subtitle="Report road issues"
          bg="bg-gray-50"
          border="border-gray-200"
        />
      </div>

      {/* CALL BUTTON */}
      <div className="px-5 pb-5">
        <button className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
          <Phone size={18} />
          Call Emergency Hotline
          <span className="opacity-90">119</span>
        </button>

        {/* SECONDARY */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button className="bg-purple-50 text-purple-600 py-2 rounded-lg text-sm font-medium">
            Find Missing Person
          </button>
          <button className="bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium">
            Rescue Camps
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 TILE COMPONENT – exact visual behavior */
function EmergencyTile({ icon, title, subtitle, bg, border }) {
  return (
    <div
      className={`border ${border} ${bg} rounded-xl p-4 cursor-pointer hover:shadow-sm transition`}
    >
      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-medium text-gray-800">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
    </div>
  );
}
