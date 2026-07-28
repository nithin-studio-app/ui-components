import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge } from "./Badge";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function Box() {
  return (
    <div
      style={{
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "8px",
        background: "#3a3d42",
      }}
    />
  );
}

function BadgeShowcase() {
  return (
    <ShowcasePage title="Badge" description="A count or dot anchored to a corner of another element.">
      <ShowcaseCard label="count">
        <Badge content={3}>
          <Box />
        </Badge>
      </ShowcaseCard>

      <ShowcaseCard label="dot">
        <Badge variant="dot">
          <Box />
        </Badge>
      </ShowcaseCard>

      <ShowcaseCard label="max truncation (content=125, max=99)">
        <Badge content={125}>
          <Box />
        </Badge>
      </ShowcaseCard>

      <ShowcaseCard label="showZero">
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Badge content={0}>
            <Box />
          </Badge>
          <Badge content={0} showZero>
            <Box />
          </Badge>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="invisible">
        <Badge content={5} invisible>
          <Box />
        </Badge>
      </ShowcaseCard>

      <ShowcaseCard label="color">
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Badge content={2} color="#d50000">
            <Box />
          </Badge>
          <Badge content={2} color="#64dd17">
            <Box />
          </Badge>
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof BadgeShowcase> = {
  title: "DataDisplay/Badge",
  component: BadgeShowcase,
};

export default meta;
type Story = StoryObj<typeof BadgeShowcase>;

export const Showcase: Story = {
  render: () => <BadgeShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Badge")).toBeInTheDocument();
    await expect(canvas.getByText("3")).toBeInTheDocument();
    await expect(canvas.getByText("99+")).toBeInTheDocument();

    // showZero=false hides the badge at 0; showZero=true shows "0".
    await expect(canvas.queryAllByText("0")).toHaveLength(1);

    // invisible hides the badge but not its child.
    await expect(canvas.queryByText("5")).not.toBeInTheDocument();
  },
};
