import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { palette } from "./palette";
import { accent } from "./accents";
import { ShowcasePage, ShowcaseCard } from "../_showcase";

const shadeKeys = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "A100", "A200", "A400", "A700"];

function ColorRow({ shades }: { shades: Record<string, string> }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {shadeKeys.map((key) => {
        const hex = shades[key];
        if (!hex) return null;
        return (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}
          >
            <div
              title={`${key} — ${hex}`}
              style={{ width: "4.5rem", height: "4.5rem", borderRadius: "8px", background: hex }}
            />
            <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#9aa0a6" }}>{key}</span>
          </div>
        );
      })}
    </div>
  );
}

function ColorsShowcase() {
  return (
    <ShowcasePage title="Palette" description="19 color families, each with shades 50–900 (plus accents on the chromatic ones).">
      {Object.entries(palette).map(([name, shades]) => (
        <ShowcaseCard key={name} label={name}>
          <ColorRow shades={shades as unknown as Record<string, string>} />
        </ShowcaseCard>
      ))}
    </ShowcasePage>
  );
}

function AccentSwatch({ hex }: { hex: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "8px", background: hex }} />
      <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#9aa0a6" }}>{hex}</span>
    </div>
  );
}

function AccentsShowcase() {
  return (
    <ShowcasePage
      title="Accents"
      description="Semantic status colors for job/task/upload states — not general UI (see Palette for that)."
    >
      {Object.entries(accent).map(([name, hex]) => (
        <ShowcaseCard key={name} label={name}>
          <AccentSwatch hex={hex} />
        </ShowcaseCard>
      ))}
    </ShowcasePage>
  );
}

const meta: Meta<typeof ColorsShowcase> = {
  title: "Foundations/Colors",
  component: ColorsShowcase,
};

export default meta;
type Story = StoryObj<typeof ColorsShowcase>;

export const Palette: Story = {
  render: () => <ColorsShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Palette")).toBeInTheDocument();

    const familyNames = Object.keys(palette);
    for (const name of familyNames) {
      await expect(canvas.getByText(name)).toBeInTheDocument();
    }

    // Every chromatic family (all but the last 3 neutrals) has 14 shades.
    const swatches = canvas.getAllByTitle(/^500 — /);
    await expect(swatches).toHaveLength(familyNames.length);
  },
};

export const Accents: Story = {
  render: () => <AccentsShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Accents")).toBeInTheDocument();

    for (const name of Object.keys(accent)) {
      await expect(canvas.getByText(name)).toBeInTheDocument();
    }
  },
};
