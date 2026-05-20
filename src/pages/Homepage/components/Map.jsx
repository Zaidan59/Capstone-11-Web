import { useNavigate } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import LeafletMapView from "../../../components/maps/LeafletMapView";

export default function Maps() {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-50 w-full py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-12 ">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
              Peta Sebaran Dapur &amp; Sekolah
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Pilih wilayah untuk melihat detail SPPG dan unit sekolah terdekat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              navigate("/maps");
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-[#136DEC] transition"
          >
            View Full Map
            <FiExternalLink className="h-4 w-4" />
          </button>
        </div>

        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.10)] md:h-[560px] lg:h-[600px]">
          <LeafletMapView
            mapClassName="h-full w-full"
            showSearch={false}
            showFilter={false}
            showLegend={true}
            loadingTopClassName="top-5"
            errorTopClassName="top-5"
          />
        </div>
      </div>
    </section>
  );
}
