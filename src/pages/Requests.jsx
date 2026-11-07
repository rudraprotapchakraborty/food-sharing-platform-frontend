import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2, Mail, RefreshCw, X } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import Avatar from "../components/Avatar";
import { FoodImage } from "../components/FoodCard";
import { formatWhen } from "../lib/format";

const STATUS = {
  PENDING: ["Waiting", "bg-[var(--progress-soft)] text-progress"],
  ACCEPTED: ["Accepted", "bg-[var(--done-soft)] text-done"],
  DECLINED: ["Declined", "bg-[var(--danger-soft)] text-danger"],
  CANCELLED: ["Cancelled", "bg-line/70 text-muted"],
  COMPLETED: ["Collected", "bg-[var(--done-soft)] text-done"],
};

function Row({ request, perspective, busy, onAnswer }) {
  const other = perspective === "incoming" ? request.requester : request.donor;
  const [label, tone] = STATUS[request.status];
  return (
    <li className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      {request.food && (
        <Link to={`/foods/${request.food.id}`} className="block w-full shrink-0 overflow-hidden rounded-2xl sm:w-36" aria-label={request.food.name}>
          <FoodImage food={request.food} className="aspect-[4/3]" />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip ${tone}`}>{label}</span>
          <span className="text-xs text-muted">{formatWhen(request.createdAt)}</span>
        </div>
        <h2 className="mt-2 truncate text-lg font-bold tracking-tight">
          {request.food ? (
            <Link to={`/foods/${request.food.id}`} className="hover:text-brand">
              {request.food.name}
            </Link>
          ) : (
            "Removed listing"
          )}
        </h2>
        {other && (
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <Avatar name={other.name} url={other.image} size={22} />
            {perspective === "incoming" ? "Asked by" : "Shared by"} <b className="text-ink">{other.name}</b>
          </p>
        )}
        {request.message && <p className="mt-2 text-sm italic text-muted">&ldquo;{request.message}&rdquo;</p>}
        {other?.email && (
          <p className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[var(--done-soft)] px-3 py-1.5 text-sm text-done">
            <Mail className="h-4 w-4" /> <a className="font-semibold underline" href={`mailto:${other.email}`}>{other.email}</a>
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {perspective === "incoming" && request.status === "PENDING" && (
          <>
            <button type="button" disabled={busy} onClick={() => onAnswer(request, "accept")} className="btn btn-primary btn-sm">
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Accept
            </button>
            <button type="button" disabled={busy} onClick={() => onAnswer(request, "decline")} className="btn btn-ghost btn-sm">
              <X className="h-3.5 w-3.5" /> Decline
            </button>
          </>
        )}
        {perspective === "mine" && (request.status === "PENDING" || request.status === "ACCEPTED") && (
          <button type="button" disabled={busy} onClick={() => onAnswer(request, "cancel")} className="btn btn-ghost btn-sm">
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Cancel request
          </button>
        )}
      </div>
    </li>
  );
}

export default function Requests() {
  const [tab, setTab] = useState("incoming");
  const [data, setData] = useState({ incoming: null, mine: null });
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [incoming, mine] = await Promise.all([api.get("/requests/incoming"), api.get("/requests/mine")]);
      setData({ incoming: incoming.data.data, mine: mine.data.data });
    } catch (err) {
      setError(getErrorMessage(err, "Could not load your requests."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const answer = async (request, action) => {
    setBusyId(request.id);
    try {
      await api.post(`/requests/${request.id}/${action}`);
      toast.success({ accept: "Request accepted", decline: "Request declined", cancel: "Request cancelled" }[action]);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      load();
    }
    setBusyId(null);
  };

  const list = data[tab];
  const waiting = data.incoming?.filter((r) => r.status === "PENDING").length ?? 0;

  return (
    <div className="frame pb-20 pt-10">
      <span className="eyeline">Inbox</span>
      <h1 className="display mt-3 text-[clamp(32px,4.4vw,52px)]">
        <span className="accent">Requests</span>
      </h1>

      <div role="tablist" aria-label="Requests" className="mt-7 inline-flex rounded-full border border-line bg-surface p-1">
        {[
          ["incoming", `For my food${waiting ? ` (${waiting})` : ""}`],
          ["mine", "My requests"],
        ].map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} type="button" onClick={() => setTab(id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === id ? "bg-brand text-on-brand" : "text-muted hover:text-ink"}`}>
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <div role="alert" className="card mt-8 grid place-items-center gap-4 p-10 text-center">
          <p className="text-muted">{error}</p>
          <button type="button" onClick={load} className="btn btn-primary btn-sm">
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      ) : !list ? (
        <div className="mt-8 space-y-4" role="status" aria-label="Loading requests">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-[120px] !rounded-3xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card mt-8 grid place-items-center gap-3 p-14 text-center">
          <p className="text-lg font-bold">{tab === "incoming" ? "No requests for your food yet" : "You have not asked for anything yet"}</p>
          <Link to={tab === "incoming" ? "/foods/new" : "/foods"} className="btn btn-primary btn-sm mt-2">
            {tab === "incoming" ? "Share food" : "Find food"}
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {list.map((r) => (
            <Row key={r.id} request={r} perspective={tab} busy={busyId === r.id} onAnswer={answer} />
          ))}
        </ul>
      )}
    </div>
  );
}
