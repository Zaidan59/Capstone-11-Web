import Navbar from "../../components/common/Navbar";  

export default function Home() {
    return (
      <div>
        <Navbar />
        <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
        <section className="text-center">
          <img
            src="./src/assets/Logo.png"
            alt="SIMBA logo"
            className="mx-auto w-36 sm:w-44 md:w-52"
          />
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-wide text-blue-700">
            SIMBA
          </h1>
          <p className="mt-1 text-slate-500">Coming Soon...</p>
        </section>
      </main>
    </div>
  );
}