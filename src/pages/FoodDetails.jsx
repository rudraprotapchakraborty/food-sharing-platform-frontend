import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, CheckCircle2, ExternalLink, Loader2, Mail, MapPin, Pencil, Send, Trash2, Users, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import Avatar from "../components/Avatar";
import { FoodImage, StatusChip, TimeChip } from "../components/FoodCard";
import { CATEGORY_LABELS, formatWhen, timeLeft } from "../lib/format";
import NotFound from "./NotFound";

/** What the signed-in person's request for this food looks like right now. */
function RequestPanel({ request, onCancel, busy }) {
  const tone = {
    PENDING: ["Waiting for an answer", "bg-[var(--progress-soft)] text-progress"],
    ACCEPTED: ["Accepted", "bg-[var(--done-soft)] text-done"],
    DECLINED: ["Declined", "bg-[var(--danger-soft)] text-danger"],
    CANCELLED: ["Cancelled", "bg-line/70 text-muted"],
    COMPLETED: ["Collected", "bg-[var(--done-soft)] text-done"],
  }[request.status];
  return (
    <div className="card mt-8 p-5" role="status">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">Your request</p>
        <span className={`chip ${tone[1]}`}>{tone[0]}</span>
      </div>
      {request.message && <p className="mt-2 text-sm italic text-muted">&ldquo;{request.message}&rdquo;</p>}
      {request.status === "ACCEPTED" && (
        <p className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-[var(--done-soft)] p-3 text-sm text-done">
          <Mail className="h-4 w-4" /> Contact {request.donor?.name}: <a className="font-semibold underline" href={`mailto:${request.donor?.email}`}>{request.donor?.email}</a>
        </p>
      )}
      {request.status === "DECLINED" && <p className="mt-3 text-sm text-muted">The donor chose someone else. You can look for something similar below.</p>}
      {(request.status === "PENDING" || request.status === "ACCEPTED") && (
        <button type="button" onClick={onCancel} disabled={busy} className="btn btn-ghost btn-sm mt-4">
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Cancel my request
        </button>
      )}
    </div>
  );
}

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [food, setFood] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | missing | error
  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/foods/${id}`);
      setFood(res.data.data);
      setState("ready");
    } catch (err) {
      setState(err?.response?.status === 404 || err?.response?.status === 400 ? "missing" : "error");
    }
  }, [id]);

  useEffect(() => {
    setState("loading");
    setRequest(null);
    load();
  }, [load]);

  useEffect(() => {
    if (!user) return;
    api.get(`/requests/for-food/${id}`).then((res) => setRequest(res.data.data)).catch(() => {});
  }, [id, user]);

  if (state === "missing") return <NotFound />;
  if (state === "error") {
    return (
      <div className="frame py-20 text-center" role="alert">
        <p className="text-muted">Could not load this listing.</p>
        <button type="button" onClick={load} className="btn btn-primary btn-sm mt-4">
          Try again
        </button>
      </div>
    );
  }
  if (state === "loading" || !food) {
    return (
      <div className="frame grid gap-10 py-12 md:grid-cols-2" role="status" aria-label="Loading listing">
        <div className="skeleton aspect-[4/3] !rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-6 w-1/2" />
          <div className="skeleton h-40" />
        </div>
      </div>
    );
  }

  const isDonor = user && food.donor?.id === user.id;
  const canManage = user && (isDonor || user.role === "ADMIN");
  const t = timeLeft(food.expiresAt);
  const liveRequest = request && (request.status === "PENDING" || request.status === "ACCEPTED");
  const canRequest = food.status === "available" && !t.expired && !isDonor && !liveRequest;

  const send = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api.post("/requests", { foodId: food.id, message: message.trim() || undefined });
      setRequest(res.data.data);
      setMessage("");
      toast.success("Request sent");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send the request."));
      load();
    }
    setSending(false);
  };

  const cancel = async () => {
    setCancelling(true);
    try {
      const res = await api.post(`/requests/${request.id}/cancel`);
      setRequest(res.data.data);
      toast.success("Request cancelled");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setCancelling(false);
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api.delete(`/foods/${food.id}`);
      toast.success("Listing removed");
      navigate("/foods", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not remove the listing."));
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="frame pb-20 pt-8">
      <Link to="/foods" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All food
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="self-start overflow-hidden rounded-3xl border border-line shadow-[var(--shadow)]">
          <FoodImage food={food} eager className="aspect-[4/3]" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={food.status} />
            <span className="chip bg-brand-soft text-brand">{CATEGORY_LABELS[food.category] ?? food.category}</span>
            <TimeChip food={food} />
          </div>
          <h1 className="display mt-4 text-[clamp(32px,4.6vw,56px)]">{food.name}</h1>

          <dl className="mt-6 space-y-3 text-[15px]">
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand" />
              <div>
                <dt className="sr-only">Servings</dt>
                <dd className="font-semibold">
                  {food.servings} {food.servings === 1 ? "serving" : "servings"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand" />
              <div>
                <dt className="sr-only">Pickup location</dt>
                <dd className="font-semibold">{food.pickupLocation}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarClock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand" />
              <div>
                <dt className="sr-only">Collect by</dt>
                <dd className="font-semibold">Collect by {formatWhen(food.expiresAt)}</dd>
              </div>
            </div>
          </dl>

          {food.notes && (
            <>
              <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted">Notes from the donor</h2>
              <p className="mt-2 max-w-[60ch] whitespace-pre-line text-[16px] leading-relaxed text-ink/90">{food.notes}</p>
            </>
          )}

          {food.donor && (
            <div className="mt-8 flex items-center gap-3">
              <Avatar name={food.donor.name} url={food.donor.image} size={44} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Shared by</p>
                <p className="font-bold">{food.donor.name}</p>
              </div>
            </div>
          )}

          {request && <RequestPanel request={request} onCancel={cancel} busy={cancelling} />}

          {canRequest && !user && (
            <div className="card mt-8 p-5">
              <p className="font-bold">Want this?</p>
              <p className="mt-1 text-sm text-muted">Sign in to send the donor a request.</p>
              <Link to={`/login?from=${encodeURIComponent(`/foods/${food.id}`)}`} className="btn btn-primary btn-sm mt-4">
                Sign in to request
              </Link>
            </div>
          )}

          {canRequest && user && (
            <form onSubmit={send} className="card mt-8 space-y-3 p-5">
              <label htmlFor="request-message" className="flex justify-between text-sm font-bold">
                Ask for this food <span className="font-normal text-muted tabular-nums">{message.length}/300</span>
              </label>
              <textarea id="request-message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={300} rows={3} placeholder="When could you collect it? (optional)" className="input resize-y" />
              <button type="submit" disabled={sending} className="btn btn-primary">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send request
              </button>
              <p className="text-xs text-muted">Your email stays private until the donor accepts.</p>
            </form>
          )}

          {!canRequest && !liveRequest && !isDonor && (
            <p className="mt-8 flex items-center gap-2 rounded-xl bg-line/50 p-3.5 text-sm text-muted">
              {food.status === "donated" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {food.status === "donated" ? "This food has already been given away." : food.status === "requested" ? "This food is reserved for someone else." : "The pickup deadline has passed."}
            </p>
          )}

          {isDonor && (
            <p className="mt-8 rounded-xl bg-brand-soft p-3.5 text-sm text-ink">
              This is your listing. <Link to="/requests" className="font-semibold text-brand underline underline-offset-2">See requests</Link> or <Link to="/my-foods" className="font-semibold text-brand underline underline-offset-2">manage your listings</Link>.
            </p>
          )}

          {canManage && (
            <div className="mt-6 flex flex-wrap gap-3">
              {food.status !== "donated" && (
                <Link to={`/foods/${food.id}/edit`} className="btn btn-ghost">
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
              )}
              <button type="button" onClick={() => setConfirming(true)} className="btn btn-ghost !text-danger hover:!bg-[var(--danger-soft)]">
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          )}

          {food.source && (
            <p className="mt-8 text-xs text-muted">
              <a href={food.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-ink">
                <ExternalLink className="h-3.5 w-3.5" /> Photo from Wikipedia
              </a>
            </p>
          )}
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Remove this listing?"
          message={`"${food.name}" will be taken off the list and any requests for it will be deleted. This cannot be undone.`}
          confirmLabel="Remove"
          busy={deleting}
          onConfirm={remove}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
