import { palette } from "./palette";

/** Semantic status colors — for job/task/upload states rather than
 * general UI (see the raw `palette` for anything else). `failed`,
 * `error`, and `danger` are the same color under three names, so
 * whichever term fits the calling domain works. */
export const accent = {
  failed: palette.red.A700,
  error: palette.red.A700,
  danger: palette.red.A700,
  success: palette.lightGreen.A700,
  inProgress: palette.lightBlue.A700,
  queued: palette.amber.A700,
  disabled: palette.grey[500],
};
