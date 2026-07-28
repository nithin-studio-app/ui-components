import { palette } from "./palette";

/** Semantic status colors — for job/task/upload states rather than
 * general UI (see the raw `palette` for anything else). `danger` covers
 * failed/error states too — same color, one name. */
export const accent = {
  danger: palette.red.A700,
  success: palette.lightGreen.A700,
  inProgress: palette.lightBlue.A700,
  queued: palette.amber.A700,
  disabled: palette.grey[500],
};
