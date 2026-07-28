const sans = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

// Roboto first (self-hosted via @fontsource/roboto, so it's guaranteed to
// actually load rather than depending on what's installed on the device),
// falling back to the same system stack as `sans`.
const defaultStack = ["Roboto", ...sans.filter((font) => font !== "Roboto")];

export const fontFamily = {
  sans: sans.join(", "),
  default: defaultStack.join(", "),
};

/** The individual fonts making up each stack, in fallback order — for
 * previewing what each one actually looks like on its own. */
export const fontFamilyFonts = {
  sans,
};
