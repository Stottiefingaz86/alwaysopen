import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const textSize = size === "large" ? "text-2xl" : "text-lg";

  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-pastel-blue"
        aria-hidden
      >
        <span className="size-3 rounded-full bg-google-blue" />
      </span>
      <span className={`${textSize} font-semibold tracking-tight text-foreground`}>
        Always<span className="text-google-blue">Open</span>
      </span>
    </Link>
  );
}
