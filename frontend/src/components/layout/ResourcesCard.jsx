import { Tent, UserSearch, ShieldCheck } from "lucide-react";

export default function ResourcesCard() {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="font-semibold mb-4">Resources</div>

      <div className="space-y-3 text-sm">
        <ResourceRow
          icon={<Tent size={18} className="text-blue-600" />}
          title="Rescue Camps"
          subtitle="Find shelters"
          bg="bg-blue-50"
        />

        <ResourceRow
          icon={<UserSearch size={18} className="text-purple-600" />}
          title="Person Finder"
          subtitle="Search missing"
          bg="bg-purple-50"
        />

        <ResourceRow
          icon={<ShieldCheck size={18} className="text-green-600" />}
          title="DMC Sri Lanka"
          subtitle="Official updates"
          bg="bg-green-50"
        />
      </div>
    </div>
  );
}

function ResourceRow({ icon, title, subtitle, bg }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${bg}`}
    >
      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-medium text-gray-800">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
}
