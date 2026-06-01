import { Phone } from "lucide-react";
import { DISPLAY_PHONE_NUMBER, trackPhoneClick } from "@/lib/analytics";

function telHref(num: string) {
  return `tel:${num.replace(/[^0-9+]/g, "")}`;
}

/**
 * Click-to-call CTA. Renders nothing unless a phone number is configured via
 * VITE_PUBLIC_PHONE_NUMBER (or VITE_CALL_TRACKING_NUMBER), so the site stays
 * clean until a real number exists. Tags click events for call tracking.
 */
export function PhoneCTA({
  location,
  className = "",
  label,
}: {
  location: string;
  className?: string;
  label?: string;
}) {
  if (!DISPLAY_PHONE_NUMBER) return null;

  return (
    <a
      href={telHref(DISPLAY_PHONE_NUMBER)}
      onClick={() => trackPhoneClick(location)}
      data-testid="link-phone-cta"
      className={`inline-flex items-center gap-2 font-medium text-primary hover:underline ${className}`}
    >
      <Phone className="h-4 w-4" />
      {label ?? `Call ${DISPLAY_PHONE_NUMBER}`}
    </a>
  );
}
