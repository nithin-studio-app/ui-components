import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { fontFamilyFonts } from "./fontFamily";
import { ShowcasePage, ShowcaseCard } from "../_showcase";

function displayName(font: string) {
  return font.replace(/^"|"$/g, "");
}

function FontSpecimen({ font }: { font: string }) {
  return (
    <div style={{ fontFamily: font }}>
      <p style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 0.65rem", color: "#f5f5f5" }}>
        Aa Bb Cc 123
      </p>
      <p style={{ fontSize: "1rem", margin: "0 0 0.5rem", color: "#f0f0f0" }}>
        The quick brown fox jumps over the lazy dog. 😀
      </p>
      <p style={{ fontSize: "0.85rem", margin: 0, color: "#a8adb4" }}>
        abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
      </p>
    </div>
  );
}

function TypographyShowcase() {
  return (
    <ShowcasePage
      title="Font family"
      description="The stack, in fallback order — each card previews one font on its own."
    >
      {fontFamilyFonts.sans.map((font) => (
        <ShowcaseCard key={font} label={displayName(font)}>
          <FontSpecimen font={font} />
        </ShowcaseCard>
      ))}
    </ShowcasePage>
  );
}

const meta: Meta<typeof TypographyShowcase> = {
  title: "Foundations/Typography",
  component: TypographyShowcase,
};

export default meta;
type Story = StoryObj<typeof TypographyShowcase>;

export const FontFamily: Story = {
  render: () => <TypographyShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Font family")).toBeInTheDocument();

    // One card per font in the stack, each labeled with that font's name.
    for (const font of fontFamilyFonts.sans) {
      await expect(canvas.getByText(displayName(font))).toBeInTheDocument();
    }

    // One specimen per card — same pangram rendered once per font.
    const pangrams = canvas.getAllByText(/The quick brown fox/);
    await expect(pangrams).toHaveLength(fontFamilyFonts.sans.length);
  },
};
