import { Link } from "react-router-dom";
import DragScroller from "../../../components/common/DragScroller";
import { useDashboardPemantauan } from "../../../hooks/useDashboardPemantauan";
import { resolveImageUrl } from "../../../utils/imageUrl";
import defaultSppgImage from "../../../assets/ProfilSPPG.png";
import defaultSchoolImage from "../../../assets/defaultSekolah.png";

function StatItem({ label, value, valueClassName = "text-slate-900" }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs font-medium text-center text-slate-400">{label}</p>
      <p
        className={`text-xl font-bold text-center leading-none ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-2">
      <div className="shrink-0" aria-hidden="true">
        {icon}
      </div>
      <p className="text-lg font-bold text-slate-900">{title}</p>
    </div>
  );
}

function SppgIcon() {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 16V8H0V6H4C3.45 6 2.97917 5.80417 2.5875 5.4125C2.19583 5.02083 2 4.55 2 4V0H8V4C8 4.55 7.80417 5.02083 7.4125 5.4125C7.02083 5.80417 6.55 6 6 6H14V3C14 2.71667 13.9042 2.47917 13.7125 2.2875C13.5208 2.09583 13.2833 2 13 2C12.7167 2 12.4792 2.09583 12.2875 2.2875C12.0958 2.47917 12 2.71667 12 3H10C10 2.16667 10.2917 1.45833 10.875 0.875C11.4583 0.291667 12.1667 0 13 0C13.8333 0 14.5417 0.291667 15.125 0.875C15.7083 1.45833 16 2.16667 16 3V6H20V8H18V16H2ZM4 4H6V2H4V4ZM4 14H9V8H4V14ZM11 14H16V8H11V14ZM4 4H6H4ZM4 14H16H4Z"
        fill="#136DEC"
      />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M11 18L4 14.2V8.2L0 6L11 0L22 6V14H20V7.1L18 8.2V14.2L11 18ZM11 9.7L17.85 6L11 2.3L4.15 6L11 9.7ZM11 15.725L16 13.025V9.25L11 12L6 9.25V13.025L11 15.725Z"
        fill="#136DEC"
      />
    </svg>
  );
}

function SppgCard({ item }) {
  const imageUrl = resolveImageUrl(item?.photoUrl, defaultSppgImage);

  return (
    <Link to={`/profil/sppg/${item.id}`} className="w-[435px] flex-shrink-0 text-decoration-none hover:text-decoration-none">
      <article className="flex flex-col gap-6 rounded-[18px] bg-white p-6 shadow-[0px_4px_4px_0_rgba(0,0,0,0.25)] hover:shadow-[0px_8px_12px_0_rgba(0,0,0,0.35)] transition-shadow h-full cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#e7f0fd]">
          <img src={imageUrl} alt={item.title} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xl font-bold text-slate-900">
            {item.title}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <svg
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208ZM4.66667 11.6667C3.10139 10.3347 1.93229 9.09757 1.15937 7.95521C0.386458 6.81285 0 5.75556 0 4.78333C0 3.325 0.469097 2.16319 1.40729 1.29792C2.34549 0.432639 3.43194 0 4.66667 0C5.90139 0 6.98785 0.432639 7.92604 1.29792C8.86424 2.16319 9.33333 3.325 9.33333 4.78333C9.33333 5.75556 8.94688 6.81285 8.17396 7.95521C7.40104 9.09757 6.23194 10.3347 4.66667 11.6667Z"
                fill="#64748B"
              />
            </svg>
            <p className="text-sm font-medium text-slate-500">
              {item.location}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 pt-2">
            <span className="rounded-full bg-[#e4f8e1] px-2 py-0.5 text-[10px] font-bold text-[#2b7d20]">
              {item.status}
            </span>
            <span className="rounded-full bg-[#e7f0fd] px-2 py-0.5 text-[10px] font-bold text-[#136dec]">
              {item.capacity}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-100 pt-6">
        <div className="grid grid-cols-3 gap-4">
          <StatItem label="Sekolah Dilayani" value={item.schoolsServed} />
          <StatItem
            label="Porsi Terdistribusi"
            value={item.distributedPortions}
          />
          <StatItem
            label="Rating Kebersihan"
            value={item.rating}
            valueClassName="text-[#fb0]"
          />
        </div>
      </div>
      </article>
    </Link>
  );
}

function SchoolCard({ item }) {
  const imageUrl = resolveImageUrl(item?.photoUrl, defaultSchoolImage);

  return (
    <Link to={`/profil/sekolah/${item.id}`} className="w-[435px] flex-shrink-0 text-decoration-none hover:text-decoration-none">
      <article className="flex flex-col gap-6 rounded-[18px] bg-white p-6 shadow-[0px_4px_4px_0_rgba(0,0,0,0.25)] hover:shadow-[0px_8px_12px_0_rgba(0,0,0,0.35)] transition-shadow h-full cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#e7f0fd]">
          <img src={imageUrl} alt={item.title} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xl font-bold text-slate-900">
            {item.title}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <svg
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208ZM4.66667 11.6667C3.10139 10.3347 1.93229 9.09757 1.15937 7.95521C0.386458 6.81285 0 5.75556 0 4.78333C0 3.325 0.469097 2.16319 1.40729 1.29792C2.34549 0.432639 3.43194 0 4.66667 0C5.90139 0 6.98785 0.432639 7.92604 1.29792C8.86424 2.16319 9.33333 3.325 9.33333 4.78333C9.33333 5.75556 8.94688 6.81285 8.17396 7.95521C7.40104 9.09757 6.23194 10.3347 4.66667 11.6667Z"
                fill="#64748B"
              />
            </svg>
            <p className="text-sm font-medium text-slate-500">
              {item.location}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 pt-2">
            <span className="rounded-full bg-[#e4f8e1] px-2 py-0.5 text-[10px] font-bold text-[#2b7d20]">
              {item.kitchen}
            </span>
            <span className="rounded-full bg-[#e7f0fd] px-2 py-0.5 text-[10px] font-bold text-[#136dec]">
              {item.students}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase text-slate-400">
          {item.menuLabel}
        </p>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-900">
              {item.menuTitle}
            </p>
            <p className="truncate text-xs font-medium text-slate-500">
              {item.menuDetail}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-base font-bold text-[#136dec]">
              {item.calories}
            </p>
            <p className="text-[10px] text-slate-400">{item.nutrition}</p>
          </div>
        </div>
      </div>
      </article>
    </Link>
  );
}

export default function DashboardPemantauan() {
  const { sppgUnits, schoolUnits, isLoading, error } =
    useDashboardPemantauan();

  return (
    <section className="bg-white py-[70px]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-8">
        <div className="flex flex-col items-center">
          <p className="text-center text-4xl font-bold text-slate-900">
            Dashboard Pemantauan Unit
          </p>

        </div>

        <div
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
          style={{ boxShadow: "0px 1px 2px 0 rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-[#136dec]/5 p-6">
            <SectionHeader
              title="Info Satuan Pelayanan (SPPG)"
              icon={<SppgIcon />}
            />
          </div>
          <div className="px-6 py-6">
            {isLoading ? (
              <p className="text-sm font-semibold text-slate-500">Memuat data SPPG...</p>
            ) : error ? (
              <p className="text-sm font-semibold text-rose-600">{error}</p>
            ) : sppgUnits.length === 0 ? (
              <p className="text-sm font-semibold text-slate-500">Belum ada data SPPG.</p>
            ) : (
              <DragScroller ariaLabel="Daftar SPPG horizontal">
                {sppgUnits.map((item) => (
                  <SppgCard key={item.id} item={item} />
                ))}
              </DragScroller>
            )}
          </div>
        </div>

        <div
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
          style={{ boxShadow: "0px 1px 2px 0 rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-[#136dec]/5 p-6">
            <SectionHeader title="Info Unit Sekolah" icon={<SchoolIcon />} />
          </div>
          <div className="px-6 py-6">
            {isLoading ? (
              <p className="text-sm font-semibold text-slate-500">Memuat data sekolah...</p>
            ) : error ? (
              <p className="text-sm font-semibold text-rose-600">{error}</p>
            ) : schoolUnits.length === 0 ? (
              <p className="text-sm font-semibold text-slate-500">Belum ada data sekolah.</p>
            ) : (
              <DragScroller ariaLabel="Daftar unit sekolah horizontal">
                {schoolUnits.map((item) => (
                  <SchoolCard key={item.id} item={item} />
                ))}
              </DragScroller>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
