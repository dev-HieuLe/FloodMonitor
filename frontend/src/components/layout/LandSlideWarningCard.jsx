import { Mountain } from "lucide-react";

export default function LandslideWarningCard() {
  return (
    <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl shadow p-5 flex flex-col justify-between">
      <div>
        <div className="font-semibold flex items-center gap-2">
          <Mountain size={18} />
          Landslide Warnings
        </div>

        <p className="text-sm opacity-90 mt-3">
          Heavy rainfall may trigger landslides. Stay alert and evacuate if
          advised.
        </p>
      </div>

      <button className="mt-4 bg-white/20 hover:bg-white/30 transition py-2 rounded-lg text-sm">
        View Details
      </button>
    </div>
  );
}
