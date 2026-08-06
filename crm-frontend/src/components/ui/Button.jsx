export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  ...props
}) {
  const base =
    "w-full rounded-lg py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#d95d08] text-white hover:bg-[#c45305] active:bg-[#ad4904]",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}