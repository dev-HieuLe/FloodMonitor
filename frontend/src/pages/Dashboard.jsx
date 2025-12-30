import TopNav from "../components/layout/TopNav";
import AlertBanner from "../components/layout/AlertBanner";
import WeatherCard from "../components/layout/WeatherCard";
import RoadConditionCard from "../components/layout/RoadConditionCard";
import EmergencyPanel from "../components/layout/EmergencyPanel";
import MapView from "../components/MapView";
import SosRequestsCard from "../components/layout/SosRequestsCard";
import RecentAlertsCard from "../components/layout/RecentAlertsCard";
import EmergencyNumbersCard from "../components/layout/EmergencyNumbersCard";
import ResourcesCard from "../components/layout/ResourcesCard";
import LandslideWarningCard from "../components/layout/LandslideWarningCard";

export default function Dashboard() {
  return (
    <div className="h-screen w-screen bg-[#F6F8FB] overflow-hidden">
      {/* TOP NAV */}
      <TopNav />

      {/* MAIN GRID */}
      <div className="grid grid-cols-[380px_1fr] gap-6 px-6 py-6 h-[calc(100vh-72px)]">
        {/* ================= LEFT COLUMN ================= */}
        <div className="h-full">
          <EmergencyPanel />
        </div>

        {/* ================= RIGHT COLUMN (SCROLLABLE) ================= */}
        <div className="h-full overflow-y-auto pr-3">
          <div className="flex flex-col gap-6 min-h-full">
            {/* ALERT */}
            <AlertBanner />

            {/* WEATHER + ROAD */}
            <div className="grid grid-cols-2 gap-5">
              <WeatherCard />
              <RoadConditionCard />
            </div>

            {/* MAP (TALLER) */}
            <div className="h-[520px] rounded-xl overflow-hidden shadow bg-white">
              <MapView />
            </div>

            {/* SOS + RECENT ALERTS */}
            <div className="grid grid-cols-2 gap-5">
              <SosRequestsCard />
              <RecentAlertsCard />
            </div>

            {/* BOTTOM ROW: EMERGENCY / RESOURCES / LANDSLIDE */}
            <div className="grid grid-cols-3 gap-5 pb-8">
              <EmergencyNumbersCard />
              <ResourcesCard />
              <LandslideWarningCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
