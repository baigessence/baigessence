type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className = "",
}: SectionHeadingProps & { className?: string }) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl text-left"} ${className}`}
    >
      <div
        className={`flex items-center gap-3 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-gold" />
        <p className="text-[11px] tracking-[0.35em] text-gold uppercase">{eyebrow}</p>
        <span className="h-px w-8 bg-gold" />
      </div>
      <h2
        className={`mt-4 font-serif text-3xl leading-tight md:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-gray-300" : "text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
