import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, HandHeart, Leaf, MessageCircleHeart, PlusCircle, Search, Soup } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { CATEGORY_LABELS } from "../lib/format";
import { FoodGrid, FoodGridSkeleton, FoodImage } from "../components/FoodCard";

const steps = [
  [PlusCircle, "Share what you will not eat", "Add a photo, how many it feeds, where to collect it and by when. It takes a minute."],
  [MessageCircleHeart, "Neighbours ask", "People send a short request. You pick who gets it, and only then do you swap contact details."],
  [HandHeart, "Hand it over", "Mark it as given away. The food ends up on a plate instead of in the bin."],
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [soon, setSoon] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/foods/soon").then((r) => setSoon(r.data.data)).catch(() => setSoon([]));
    api.get("/foods/categories").then((r) => setCategories(r.data.data)).catch(() => {});
    api.get("/public/stats").then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/foods?q=${encodeURIComponent(query.trim())}` : "/foods");
  };

  const hero = (soon ?? []).slice(0, 3);

  return (
    <>
      <section className="frame grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-20">
        <div className="hero-stagger">
          <span className="eyeline">Food sharing platform</span>
          <h1 className="display mt-5 text-[clamp(42px,6.4vw,84px)]">
            Good food deserves a <span className="accent">plate</span>.
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted">
            Share surplus food with people nearby, or find something good to eat. Browse what is on offer, send a request and collect it before the deadline.
          </p>
          <form onSubmit={search} className="mt-8 flex max-w-[520px] items-center gap-2 rounded-full border border-line bg-surface p-1.5 shadow-[var(--shadow)] focus-within:border-brand">
            <Search className="ml-3 h-5 w-5 shrink-0 text-muted" />
            <label className="sr-only" htmlFor="hero-search">
              Search food
            </label>
            <input id="hero-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Bread, curry, apples..." className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[15px] outline-none placeholder:text-muted/70" />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/foods/new" className="btn btn-ink">
              Share food <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/foods" className="btn btn-ghost">
              Find food
            </Link>
            {!user && (
              <Link to="/login" className="btn btn-ghost">
                Try a test account
              </Link>
            )}
          </div>
          {stats && stats.shared > 0 && (
            <dl className="mt-10 flex flex-wrap gap-x-9 gap-y-4">
              {[
                ["Listings shared", stats.shared],
                ["Available now", stats.available],
                ["Meals handed over", stats.donated],
              ].map(([label, value]) => (
                <div key={label}>
                  <dd className="text-3xl font-bold tracking-tight tabular-nums">{value.toLocaleString()}</dd>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="grid-panel relative mx-auto aspect-[5/4] w-full max-w-[560px] overflow-hidden rounded-[28px] border border-line" aria-hidden={hero.length === 0}>
          {hero.length === 3 ? (
            hero.map((f, i) => (
              <Link
                key={f.id}
                to={`/foods/${f.id}`}
                tabIndex={i === 1 ? 0 : -1}
                aria-label={f.name}
                className={`absolute aspect-square w-[34%] overflow-hidden rounded-full border-[6px] border-surface shadow-2xl transition hover:z-20 hover:scale-105 ${
                  ["left-[8%] top-[16%]", "float-b left-[34%] top-[40%] z-10", "left-[58%] top-[14%]"][i]
                }`}
              >
                <FoodImage food={f} eager className="h-full w-full" />
              </Link>
            ))
          ) : (
            <div className="grid h-full place-items-center">
              <Soup className="h-10 w-10 text-brand/60" />
            </div>
          )}
          <div className="float-a absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold text-ink shadow-lg ring-1 ring-line">
            <Leaf className="h-3.5 w-3.5 text-done" /> Collect it before it goes
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16" data-reveal>
        <div className="frame">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyeline">Going soon</span>
              <h2 className="display mt-4 text-[clamp(28px,4vw,46px)]">
                Ready to <span className="accent">collect</span>
              </h2>
            </div>
            <Link to="/foods" className="btn btn-ghost btn-sm">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8">
            {soon === null ? (
              <FoodGridSkeleton count={4} />
            ) : soon.length === 0 ? (
              <div className="card grid place-items-center gap-3 p-12 text-center">
                <p className="text-lg font-bold">Nothing is on offer right now</p>
                <Link to="/foods/new" className="btn btn-primary btn-sm">
                  Be the first to share
                </Link>
              </div>
            ) : (
              <FoodGrid foods={soon} />
            )}
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="pb-16" data-reveal>
          <div className="frame">
            <span className="eyeline">Browse</span>
            <h2 className="display mt-4 text-[clamp(28px,4vw,46px)]">
              What are you <span className="accent">craving</span>?
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <li key={c.category}>
                  <Link to={`/foods?category=${c.category}`} className="btn btn-ghost btn-sm">
                    {CATEGORY_LABELS[c.category] ?? c.category} <span className="text-muted">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="how" className="border-t border-line bg-surface/40 py-20" data-reveal>
        <div className="frame">
          <span className="eyeline">How it works</span>
          <h2 className="display mt-4 max-w-[640px] text-[clamp(30px,4.4vw,52px)]">
            Three steps from <span className="accent">spare</span> to shared.
          </h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map(([Icon, title, text], i) => (
              <li key={title} className="card p-7 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[var(--shadow)]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-serif text-5xl italic leading-none text-brand/40">{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="frame py-20" data-reveal>
        <div className="grid-panel rounded-[32px] border border-line px-6 py-14 text-center sm:px-12">
          <h2 className="display mx-auto max-w-[640px] text-[clamp(30px,4vw,48px)]">
            Less waste, more <span className="accent">neighbours</span> fed.
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-muted">Have too much? Short of a meal? Either way you are in the right place.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/foods/new" className="btn btn-primary">
              Share food <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/foods" className="btn btn-ghost">
              Find food
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
