import { useEffect, useState } from "react";
import { progressColor } from "../progress-bar/progressColor";
import { accent } from "../../foundations/colors";
import "./Spinner.css";

export interface UploadItem {
  id: string | number;
  name: string;
  /** 0–1 */
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

export interface SpinnerProps {
  uploads: UploadItem[];
  /** Called once the success celebration (or the error state's timeout) finishes. */
  onExited?: () => void;
}

type Phase = "progress" | "spin" | "check" | "exit";

const SPIN_MS = 600;
const CHECK_HOLD_MS = 2000;
const EXIT_MS = 450;
const ERROR_DISMISS_MS = 4000;

// A full-screen upload-progress overlay that celebrates (spin -> checkmark
// -> hold -> exit) on a clean finish, or lingers briefly then dismisses on
// its own if any upload errored. The ring itself is decorative (aria-hidden)
// — a visually-hidden live region carries the same information as text so
// screen reader users get the status changes too, not just a percentage ring.
export function Spinner({ uploads, onExited }: SpinnerProps) {
  const [phase, setPhase] = useState<Phase>("progress");
  const [wasAllDone, setWasAllDone] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const errorCount = uploads.filter((u) => u.status === "error").length;
  const resolvedCount = uploads.filter((u) => u.status !== "uploading").length;
  const current = uploads.find((u) => u.status === "uploading");
  const fraction = uploads.length === 0 ? 0 : (resolvedCount + (current?.progress ?? 0)) / uploads.length;
  const pct = Math.round(fraction * 100);
  const allDone = uploads.length > 0 && resolvedCount === uploads.length;
  const color = errorCount > 0 ? accent.error : progressColor(pct);

  // Kick off the celebration the instant a run finishes cleanly, without
  // waiting a render behind an effect — an errored run just stays on
  // "progress" (red) and is dismissed by the timer effect below instead.
  if (allDone !== wasAllDone) {
    setWasAllDone(allDone);
    const shouldCelebrate = allDone && errorCount === 0;
    setCelebrating(shouldCelebrate);
    setPhase(shouldCelebrate ? "spin" : "progress");
  }

  // Chains the spin -> check -> hold -> exit sequence once a clean run
  // starts celebrating. Gated on `celebrating` rather than `phase` itself —
  // `phase` changes on every step of this same sequence, and re-running an
  // effect on its own dependency change would tear down and cancel whatever
  // timers it had just scheduled before they get a chance to fire.
  useEffect(() => {
    if (!celebrating) return;
    const t1 = setTimeout(() => setPhase("check"), SPIN_MS);
    const t2 = setTimeout(() => setPhase("exit"), SPIN_MS + CHECK_HOLD_MS);
    const t3 = setTimeout(() => onExited?.(), SPIN_MS + CHECK_HOLD_MS + EXIT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scoped to the start of a celebration run only
  }, [celebrating]);

  // A run that finished with errors doesn't celebrate — just dismiss it
  // after a beat so it doesn't linger forever.
  useEffect(() => {
    if (!allDone || errorCount === 0) return;
    const timer = setTimeout(() => onExited?.(), ERROR_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scoped to the completed+errored transition only
  }, [allDone, errorCount]);

  if (uploads.length === 0) return null;

  const showCheck = phase === "check" || phase === "exit";
  const ringClassName = ["spinner", phase === "spin" && "spinner-spin", phase === "exit" && "spinner-exit"]
    .filter(Boolean)
    .join(" ");

  const statusText =
    errorCount > 0
      ? `${errorCount} of ${uploads.length} uploads failed`
      : allDone
        ? "All uploads complete"
        : `Uploading, ${pct}% complete`;

  return (
    <div className="spinner-backdrop">
      <div
        className={ringClassName}
        aria-hidden="true"
        style={{ background: `conic-gradient(${color} ${pct * 3.6}deg, #2a2c30 0deg)` }}
      >
        <div className="spinner-inner">
          {showCheck ? (
            <svg className="spinner-check" viewBox="0 0 52 52" fill="none">
              <path d="M15 27l7 7 15-15" className="spinner-check-mark" stroke={accent.success} />
            </svg>
          ) : (
            <span className="spinner-pct">{pct}%</span>
          )}
        </div>
      </div>
      <span className="spinner-sr-status" role="status" aria-live="polite">
        {statusText}
      </span>
    </div>
  );
}
