import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Text } from "./Text";
import type { TextVariant } from "./Text";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const headingVariants: TextVariant[] = ["h1", "h2", "h3", "h4", "h5", "h6"];
const textVariants: TextVariant[] = ["subtitle1", "subtitle2", "body1", "body2", "caption", "overline"];

function TextShowcase() {
  return (
    <ShowcasePage title="Text" description="Semantic variant scale, each mapped to a sensible default element.">
      {/* Headings share one card, stacked h1 through h6 in order -- each
          only ever +1 from the previous, so the page's heading outline
          stays valid (unlike giving each its own card, which would jump
          straight from the card's own h2 label to e.g. h5). */}
      <ShowcaseCard label="headings (h1-h6)">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {headingVariants.map((variant) => (
            <Text key={variant} variant={variant}>
              {variant}. The quick brown fox jumps over the lazy dog.
            </Text>
          ))}
        </div>
      </ShowcaseCard>

      {textVariants.map((variant) => (
        <ShowcaseCard key={variant} label={variant}>
          <Text variant={variant}>The quick brown fox jumps over the lazy dog.</Text>
        </ShowcaseCard>
      ))}

      <ShowcaseCard label='as="div" (h4 styling, no heading semantics)'>
        <Text variant="h4" as="div">
          Styled like a heading, rendered as a div
        </Text>
      </ShowcaseCard>

      <ShowcaseCard label="color override">
        <Text variant="body1" color="#ffab00">
          Custom color via the color prop
        </Text>
      </ShowcaseCard>

      <ShowcaseCard label="noWrap">
        <div style={{ width: "12rem" }}>
          <Text variant="body1" noWrap>
            This is a long line of text that should truncate with an ellipsis instead of wrapping.
          </Text>
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof TextShowcase> = {
  title: "DataDisplay/Text",
  component: TextShowcase,
};

export default meta;
type Story = StoryObj<typeof TextShowcase>;

export const Showcase: Story = {
  render: () => <TextShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Text")).toBeInTheDocument();

    // Default element mapping is correct for headings. (2 h1s expected --
    // ShowcasePage's own title plus the h1-variant example.)
    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(2);
    await expect(canvas.getByRole("heading", { level: 6 })).toBeInTheDocument();

    // as="div" drops heading semantics even with h4 styling.
    await expect(canvas.getByText("Styled like a heading, rendered as a div").tagName).toBe("DIV");
  },
};
