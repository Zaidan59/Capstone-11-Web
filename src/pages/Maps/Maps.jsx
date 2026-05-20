import NavBar from "../../components/common/Navbar";
import LeafletMapView from "../../components/maps/LeafletMapView";

export default function Maps() {
  return (
    <>
      <NavBar />
      <main className="relative h-screen w-screen overflow-hidden bg-slate-950">
        <LeafletMapView
          mapClassName="h-full w-full"
          showSearch={true}
          showFilter={true}
          showLegend={true}
          loadingTopClassName="top-5"
          errorTopClassName="top-16"
        />
      </main>
    </>
  );
}
