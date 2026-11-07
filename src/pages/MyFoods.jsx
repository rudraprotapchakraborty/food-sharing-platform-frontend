import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCheck, Inbox, Pencil, Plus, RefreshCw, Trash2, Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import ConfirmDialog from "../components/ConfirmDialog";
import { FoodImage, StatusChip, TimeChip } from "../components/FoodCard";
import { formatWhen } from "../lib/format";

export default function MyFoods() {
  const [foods, setFoods] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [removing, setRemoving] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await api.get("/foods/mine");
      setFoods(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load your listings."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (food, path, success) => {
    setBusyId(food.id);
    try {
      await api.post(`/foods/${food.id}/${path}`);
      toast.success(success);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setBusyId(null);
  };

  const remove = async () => {
    const food = removing;
    setBusyId(food.id);
    try {
      await api.delete(`/foods/${food.id}`);
      toast.success("Listing removed");
      setRemoving(null);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setRemoving(null);
    }
    setBusyId(null);
  };

  return (
    <div className="frame pb-20 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyeline">You shared</span>
          <h1 className="display mt-3 text-[clamp(32px,4.4vw,52px)]">
            My <span className="accent">listings</span>
          </h1>
        </div>
        <Link to="/foods/new" className="btn btn-primary">
          <Plus className="h-4 w-4" /> Share food
        </Link>
      </div>

      {error ? (
        <div role="alert" className="card mt-10 grid place-items-center gap-4 p-10 text-center">
          <p className="text-muted">{error}</p>
          <button type="button" onClick={load} className="btn btn-primary btn-sm">
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      ) : !foods ? (
        <div className="mt-8 space-y-4" role="status" aria-label="Loading your listings">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-[130px] !rounded-3xl" />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="card mt-10 grid place-items-center gap-4 p-14 text-center">
          <p className="text-lg font-bold">You have not shared anything yet</p>
          <p className="max-w-sm text-sm text-muted">Got food you will not finish? List it and let a neighbour enjoy it.</p>
          <Link to="/foods/new" className="btn btn-primary">
            Share food
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {foods.map((f) => (
            <li key={f.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <Link to={`/foods/${f.id}`} className="block w-full shrink-0 overflow-hidden rounded-2xl sm:w-44" aria-label={f.name}>
                <FoodImage food={f} className="aspect-[4/3]" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip status={f.status} />
                  <TimeChip food={f} />
                  {f.pendingRequests > 0 && (
                    <Link to="/requests" className="chip bg-brand-soft text-brand hover:underline">
                      <Inbox className="h-3 w-3" /> {f.pendingRequests} {f.pendingRequests === 1 ? "request" : "requests"}
                    </Link>
                  )}
                </div>
                <h2 className="mt-2 truncate text-lg font-bold tracking-tight">
                  <Link to={`/foods/${f.id}`} className="hover:text-brand">
                    {f.name}
                  </Link>
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {f.servings} servings · collect by {formatWhen(f.expiresAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {f.status === "requested" && (
                  <>
                    <button type="button" disabled={busyId === f.id} onClick={() => act(f, "donated", "Marked as handed over")} className="btn btn-primary btn-sm">
                      <CheckCheck className="h-3.5 w-3.5" /> Handed over
                    </button>
                    <button type="button" disabled={busyId === f.id} onClick={() => act(f, "reopen", "Back on the list")} className="btn btn-ghost btn-sm">
                      <Undo2 className="h-3.5 w-3.5" /> Put back
                    </button>
                  </>
                )}
                {f.status !== "donated" && (
                  <Link to={`/foods/${f.id}/edit`} className="btn btn-ghost btn-sm">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                )}
                <button type="button" onClick={() => setRemoving(f)} aria-label={`Remove ${f.name}`} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-[var(--danger-soft)] hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {removing && (
        <ConfirmDialog
          title="Remove this listing?"
          message={`"${removing.name}" will be taken off the list and any requests for it will be deleted. This cannot be undone.`}
          confirmLabel="Remove"
          busy={busyId === removing.id}
          onConfirm={remove}
          onCancel={() => setRemoving(null)}
        />
      )}
    </div>
  );
}
