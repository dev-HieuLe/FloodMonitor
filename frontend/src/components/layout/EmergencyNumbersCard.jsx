import { Phone } from "lucide-react";

export default function EmergencyNumbersCard() {
  return (
    <div className="bg-gradient-to-b from-red-600 to-red-500 text-white rounded-xl shadow p-5">
      <div className="font-semibold mb-4 flex items-center gap-2">
        <Phone size={18} />
        Emergency
      </div>

      <div className="space-y-3 text-sm">
        <EmergencyRow number="119" label="Police" />
        <EmergencyRow number="117" label="Disaster" />
        <EmergencyRow number="1990" label="Ambulance" />
      </div>
    </div>
  );
}

function EmergencyRow({ number, label }) {
  return (
    <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/20 transition">
      <span className="font-semibold">{number}</span>
      <span className="text-xs opacity-90">{label}</span>
    </div>
  );
}
