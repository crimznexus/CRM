import logo from "../../assets/logo.png";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <div className="relative w-full md:w-1/2 min-h-[320px] md:min-h-screen flex flex-col justify-between px-8 py-10 md:px-16 md:py-14 bg-gradient-to-br from-[#061739] via-[#0f2c72] to-[#163c9c] overflow-hidden text-white">
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl">
              <img src={logo} alt="Wessmaa logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-wide text-white">Wessmaa</p>
              <p className="text-sm text-slate-300">CRM built for local sales teams.</p>
            </div>
          </div>

          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6">
              Master your local sales pipeline.
            </h1>
            <p className="text-slate-200/85 text-base leading-relaxed">
              Discover, organize, and convert leads from Google Maps. The most precise local lead generation tool for modern sales teams.
            </p>
          </div>
        </div>

        <div className="text-teal-100/70 text-sm">
          Trusted by teams across agencies, consultancies, and local businesses.
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
      </div>

      {/* Content panel */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center gap-4 bg-[#eef4ff] px-6 py-12">
        {children}
      </div>
    </div>
  );
}