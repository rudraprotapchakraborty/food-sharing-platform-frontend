import { useEffect, useState } from "react";
import { Clock, Heart, MapPin } from "lucide-react";
import api from "../lib/api";
import { FoodImage } from "./FoodCard";

const spots = ["left-[8%] top-[16%]", "float-b left-[34%] top-[40%] z-10", "left-[58%] top-[14%]"];
// Used only until real photos arrive, or when they cannot be loaded
const fallback = [
  ["radial-gradient(circle at 35% 30%, #f59f00, #d9480f)", "Fresh bread"],
  ["radial-gradient(circle at 35% 30%, #69db7c, #2b8a3e)", "Garden salad"],
  ["radial-gradient(circle at 35% 30%, #ff8787, #c92a2a)", "Hot curry"],
];

const ring = "absolute aspect-square w-[34%] overflow-hidden rounded-full border-[6px] border-white/90 shadow-2xl";

/** A table of plates for the sign-in screens, using photos of what is on offer right now. Purely decorative. */
export default function PlateArt({ className = "" }) {
  const [foods, setFoods] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/foods/soon")
      .then((res) => !cancelled && setFoods(res.data.data.slice(0, 3)))
      .catch(() => !cancelled && setFoods([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const photos = foods && foods.length === 3 ? foods : null;

  return (
    <div className={`grid-panel relative aspect-[5/4] overflow-hidden rounded-[28px] border border-line ${className}`} aria-hidden="true">
      {photos
        ? photos.map((f, i) => (
            <div key={f.id} className={`${ring} ${spots[i]}`}>
              <FoodImage food={f} eager className="h-full w-full" />
            </div>
          ))
        : fallback.map(([tone, label], i) => (
            <div key={label} className={`${ring} ${spots[i]}`} style={{ background: tone }}>
              <span className="absolute inset-0 grid place-items-center text-center text-[11px] font-bold uppercase tracking-wider text-white/90">{label}</span>
            </div>
          ))}
      <div className="float-a absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold text-ink shadow-lg ring-1 ring-line">
        <Heart className="h-3.5 w-3.5 fill-brand text-brand" /> Shared with a neighbour
      </div>
      <div className="absolute bottom-5 right-5 hidden items-center gap-3 rounded-2xl bg-surface px-4 py-2.5 text-xs font-semibold text-muted shadow-lg ring-1 ring-line sm:flex">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Nearby</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Today</span>
      </div>
    </div>
  );
}
