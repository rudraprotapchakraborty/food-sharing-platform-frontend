export const CATEGORY_LABELS = {
  meals: "Meals",
  bakery: "Bakery",
  produce: "Fruit and veg",
  snacks: "Snacks",
  desserts: "Desserts",
  other: "Other",
};

export const STATUS_LABELS = { available: "Available", requested: "Reserved", donated: "Given away" };

/** A date as the value a datetime-local input expects, in the person's own time zone. */
export function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "2h 15m left", "3 days left" or "Expired". `urgent` is true in the last six hours. */
export function timeLeft(iso, now = Date.now()) {
  const ms = new Date(iso).getTime() - now;
  if (ms <= 0) return { label: "Expired", expired: true, urgent: false };
  const minutes = Math.floor(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  let label;
  if (days >= 2) label = `${days} days left`;
  else if (hours >= 1) label = `${hours}h ${String(minutes % 60).padStart(2, "0")}m left`;
  else label = `${Math.max(1, minutes)} min left`;
  return { label, expired: false, urgent: hours < 6 };
}

/** "Today, 6:30 PM" or "Sat 8 Nov, 6:30 PM". */
export function formatWhen(iso) {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86_400_000);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`;
  return `${d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}, ${time}`;
}
