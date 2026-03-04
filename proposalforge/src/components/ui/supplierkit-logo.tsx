export function SupplierKitIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 3C5 2.44772 5.44772 2 6 2H18C18.5523 2 19 2.44772 19 3V21.382C19 22.1395 18.1459 22.5762 17.5279 22.1382L12.4721 18.5559C12.1879 18.3538 11.8121 18.3538 11.5279 18.5559L6.47214 22.1382C5.85412 22.5762 5 22.1395 5 21.382V3Z"
        fill="#059669"
      />
    </svg>
  );
}

export function SupplierKitLogo({
  size = "default",
}: {
  size?: "default" | "sm" | "lg";
}) {
  const iconSizes = { sm: "h-4 w-4", default: "h-5 w-5", lg: "h-6 w-6" };
  const textSizes = { sm: "text-[15px]", default: "text-[18px]", lg: "text-[22px]" };

  return (
    <div className="flex items-center gap-1.5">
      <span className={`${textSizes[size]} font-bold text-[#111] tracking-tight`}>
        SupplierKit
      </span>
      <SupplierKitIcon className={`${iconSizes[size]} -mt-1`} />
    </div>
  );
}
