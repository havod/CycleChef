import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6 text-primary"
      >
        <path d="M12 22c-5 0-9-4.5-9-10 0-5.5 4-10 9-10s9 4.5 9 10c0 5.5-4 10-9 10z" />
        <path d="M12 2a7 7 0 0 0-7 7c0 3.9 3.1 7 7 7s7-3.1 7-7c0-3.9-3.1-7-7-7z" />
        <path d="m14.5 4.5-.4.4" />
      </svg>
      <span className="font-headline text-xl font-bold tracking-tight text-foreground">
        SmartHer Meal
      </span>
    </div>
  );
}
