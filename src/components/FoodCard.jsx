import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, UtensilsCrossed, Users } from "lucide-react";
import Avatar from "./Avatar";
import { STATUS_LABELS, timeLeft } from "../lib/format";

const STATUS_STYLE = {
  available: "bg-[var(--done-soft)] text-done",
  requested: "bg-[var(--progress-soft)] text-progress",
  donated: "bg-line/70 text-muted",
};

export function StatusChip({ status, className = "" }) {
  return <span className={`chip ${STATUS_STYLE[status] ?? STATUS_STYLE.donated} ${className}`}>{STATUS_LABELS[status] ?? status}</span>;
}

/** How long is left to collect the food. Hidden once it is given away. */
export function TimeChip({ food, className = "" }) {
  if (food.status === "donated") return null;
  const t = timeLeft(food.expiresAt);
  const tone = t.expired ? "bg-[var(--danger-soft)] text-danger" : t.urgent ? "bg-[var(--progress-soft)] text-progress" : "bg-line/60 text-muted";
  return (
    <span className={`chip ${tone} ${className}`}>
      <Clock className="h-3 w-3" /> {t.label}
    </span>
  );
}

/** Food photo with a plate icon shown when the picture is missing or fails to load. */
export function FoodImage({ food, className = "", eager = false }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const failed = failedUrl === food.image;
  return (
    <div className={`relative overflow-hidden bg-brand-soft ${className}`}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center gap-2 p-4 text-center text-muted">
          <UtensilsCrossed className="h-8 w-8 text-brand" />
          <span className="text-sm font-semibold">{food.name}</span>
        </div>
      ) : (
        <img
          src={food.image}
          alt={food.name}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(food.image)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

export default function FoodCard({ food, eager = false }) {
  return (
    <article className="group">
      <Link to={`/foods/${food.id}`} className="card block h-full overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-xl">
        <div className="relative">
          <FoodImage food={food} eager={eager} className="aspect-[4/3] transition duration-500 group-hover:scale-[1.03]" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <StatusChip status={food.status} className="!bg-paper/90 backdrop-blur" />
          </div>
          <div className="absolute bottom-3 left-3">
            <TimeChip food={food} className="!bg-paper/90 backdrop-blur" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-[16px] font-bold tracking-tight text-ink">{food.name}</h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{food.pickupLocation}</span>
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <Users className="h-3.5 w-3.5 text-brand" /> {food.servings} {food.servings === 1 ? "serving" : "servings"}
            </span>
            {food.donor && (
              <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted">
                <Avatar name={food.donor.name} url={food.donor.image} size={22} />
                <span className="truncate">{food.donor.name.split(" ")[0]}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FoodGrid({ foods, eagerCount = 3 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {foods.map((f, i) => (
        <FoodCard key={f.id} food={f} eager={i < eagerCount} />
      ))}
    </div>
  );
}

export function FoodGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading food">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-[4/3] !rounded-none" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-3 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
