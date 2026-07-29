import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Divider } from "./Divider";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function Box({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        background: "#3a3d42",
        borderRadius: "6px",
        color: "#f0f0f0",
        fontSize: "0.85rem",
      }}
    >
      {label}
    </div>
  );
}

function DividerShowcase() {
  return (
    <ShowcasePage title="Divider" description="A thin rule separating content, horizontal or vertical, with an optional label.">
      <ShowcaseCard
        label="horizontal"
        code={`<Box label="Above" />
<Divider />
<Box label="Below" />`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Box label="Above" />
          <Divider />
          <Box label="Below" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="vertical"
        code={`<Box label="Left" />
<Divider orientation="vertical" />
<Box label="Right" />`}
      >
        <div style={{ display: "flex", alignItems: "stretch", gap: "0.75rem", height: "3rem" }}>
          <Box label="Left" />
          <Divider orientation="vertical" />
          <Box label="Right" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="inset"
        code={`<Box label="Above" />
<Divider inset />
<Box label="Below" />`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Box label="Above" />
          <Divider inset />
          <Box label="Below" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="with label" code={`<Divider>OR</Divider>`}>
        <div style={{ width: "16rem" }}>
          <Divider>OR</Divider>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="vertical with label" code={`<Divider orientation="vertical">OR</Divider>`}>
        <div style={{ display: "flex", alignItems: "stretch", height: "5rem" }}>
          <Divider orientation="vertical">OR</Divider>
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof DividerShowcase> = {
  title: "DataDisplay/Divider",
  component: DividerShowcase,
};

export default meta;
type Story = StoryObj<typeof DividerShowcase>;

export const Showcase: Story = {
  render: () => <DividerShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Divider")).toBeInTheDocument();

    const separators = canvas.getAllByRole("separator");
    // hr elements (horizontal/vertical/inset, no label) + the 2 with a
    // text label rendered as role="separator" divs.
    await expect(separators.length).toBeGreaterThanOrEqual(5);

    await expect(canvas.getAllByText("OR")).toHaveLength(2);
  },
};
