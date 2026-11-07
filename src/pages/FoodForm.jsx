import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImageOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { CATEGORY_LABELS, toLocalInput } from "../lib/format";
import { Field } from "../components/auth/Field";
import { FormMessage } from "../components/auth/AuthShell";
import NotFound from "./NotFound";

const defaultDeadline = () => toLocalInput(new Date(Date.now() + 6 * 3600_000));
const empty = () => ({ name: "", category: "", servings: "", pickupLocation: "", expiresAt: defaultDeadline(), notes: "", image: "" });

/** Share food, or edit a listing when an :id is in the address. */
export default function FoodForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [state, setState] = useState(editing ? "loading" : "ready"); // loading | ready | missing | forbidden | locked
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!editing) return;
    let cancelled = false;
    api
      .get(`/foods/${id}`)
      .then((res) => {
        if (cancelled) return;
        const f = res.data.data;
        if (user && user.role !== "ADMIN" && f.donor?.id !== user.id) return setState("forbidden");
        if (f.status === "donated") return setState("locked");
        setForm({ name: f.name, category: f.category, servings: f.servings, pickupLocation: f.pickupLocation, expiresAt: toLocalInput(f.expiresAt), notes: f.notes, image: f.image });
        setState("ready");
      })
      .catch(() => !cancelled && setState("missing"));
    return () => {
      cancelled = true;
    };
  }, [id, editing, user]);

  useEffect(() => setImageFailed(false), [form.image]);

  if (state === "missing") return <NotFound />;
  if (state === "forbidden" || state === "locked") {
    return (
      <div className="frame py-20 text-center" role="alert">
        <h1 className="display text-3xl">{state === "locked" ? "This food has been given away" : "You can only edit listings you shared"}</h1>
        <Link to={`/foods/${id}`} className="btn btn-primary mt-6">
          Back to the listing
        </Link>
      </div>
    );
  }
  if (state === "loading") {
    return (
      <div className="frame py-12" role="status" aria-label="Loading">
        <div className="skeleton h-[480px] max-w-3xl" />
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.category) return setError("Please pick a category.");
    const deadline = new Date(form.expiresAt);
    if (Number.isNaN(deadline.getTime())) return setError("Please choose a pickup deadline.");
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        category: form.category,
        servings: Number(form.servings),
        pickupLocation: form.pickupLocation.trim(),
        expiresAt: deadline.toISOString(),
        notes: form.notes.trim(),
        image: form.image.trim(),
      };
      const res = editing ? await api.patch(`/foods/${id}`, body) : await api.post("/foods", body);
      toast.success(editing ? "Listing updated" : "Your food is on the list");
      navigate(`/foods/${res.data.data.id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not save the listing."));
      setSaving(false);
    }
  };

  const showImage = form.image && !imageFailed;

  return (
    <div className="frame pb-20 pt-8">
      <Link to={editing ? `/foods/${id}` : "/foods"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="display mt-4 text-[clamp(32px,4.4vw,52px)]">
        {editing ? "Edit your " : "Share "}
        <span className="accent">{editing ? "listing" : "food"}</span>
      </h1>
      {user?.isDemo && !editing && (
        <p role="note" className="mt-4 rounded-2xl border border-brand/25 bg-brand-soft p-3.5 text-sm">
          <b>Test account.</b> You can have up to 10 listings of your own and edit or remove those, but not the sample listings.
        </p>
      )}

      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <FormMessage error={error} />
          <Field label="What is it?" value={form.name} onChange={set("name")} required minLength={2} maxLength={80} placeholder="Homemade vegetable soup" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-semibold">
                Category
              </label>
              <select id="category" value={form.category} onChange={(e) => set("category")(e.target.value)} required className="input">
                <option value="" disabled>
                  Choose a category
                </option>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Servings" type="number" value={String(form.servings)} onChange={set("servings")} required min={1} max={500} placeholder="4" hint="How many people it can feed." />
          </div>

          <Field label="Where can it be collected?" value={form.pickupLocation} onChange={set("pickupLocation")} required minLength={3} maxLength={150} placeholder="Maple Street library steps" hint="Shown to everyone: pick a public place or just the area, not your home address." />

          <div className="space-y-1.5">
            <label htmlFor="expiresAt" className="text-sm font-semibold">
              Collect by
            </label>
            <input id="expiresAt" type="datetime-local" value={form.expiresAt} onChange={(e) => set("expiresAt")(e.target.value)} required className="input" />
            <p className="text-xs text-muted">After this time the listing disappears from the list.</p>
          </div>

          <Field label="Photo link" type="url" value={form.image} onChange={set("image")} required maxLength={800} placeholder="https://example.com/photo.jpg" hint="A direct link to an image (JPG, PNG or WebP)." />

          <div className="space-y-1.5">
            <label htmlFor="notes" className="flex justify-between text-sm font-semibold">
              Notes <span className="font-normal text-muted tabular-nums">{form.notes.length}/500</span>
            </label>
            <textarea id="notes" value={form.notes} onChange={(e) => set("notes")(e.target.value)} maxLength={500} rows={4} className="input resize-y" placeholder="Ingredients, allergens, what to bring..." />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} {editing ? "Save changes" : "Share food"}
            </button>
            <Link to={editing ? `/foods/${id}` : "/foods"} className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </div>

        <aside aria-label="Photo preview" className="order-first lg:order-none">
          <p className="mb-2 text-sm font-semibold">Preview</p>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[360px] overflow-hidden rounded-2xl border border-line bg-brand-soft shadow-[var(--shadow)]">
            {showImage ? (
              <img src={form.image} alt="Photo preview" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center gap-2 p-6 text-center text-sm text-muted">
                <ImageOff className="h-8 w-8" />
                {form.image ? "That link does not load as an image." : "Paste a photo link to see it here."}
              </div>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
