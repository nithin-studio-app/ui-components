import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProgressBar } from "./ProgressBar";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function ProgressBarShowcase() {
  return (
    <ShowcasePage title="ProgressBar" description="Percentage-to-color-interpolated progress, in several shapes.">
      <ShowcaseCard label="ring" code={`<ProgressBar variant="ring" pct={42} />`}>
        <ProgressBar variant="ring" pct={42} aria-label="Upload progress" />
      </ShowcaseCard>

      <ShowcaseCard label="linear" code={`<ProgressBar variant="linear" pct={67} showLabel />`}>
        <div style={{ width: "16rem" }}>
          <ProgressBar variant="linear" pct={67} showLabel aria-label="Download progress" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="segmented" code={`<ProgressBar variant="segmented" segments={5} completed={3} />`}>
        <div style={{ width: "16rem" }}>
          <ProgressBar variant="segmented" segments={5} completed={3} aria-label="Step 3 of 5" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="indeterminate" code={`<ProgressBar variant="indeterminate" />`}>
        <div style={{ width: "16rem" }}>
          <ProgressBar variant="indeterminate" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="gauge" code={`<ProgressBar variant="gauge" pct={72} />`}>
        <ProgressBar variant="gauge" pct={72} aria-label="Disk usage" />
      </ShowcaseCard>

      <ShowcaseCard
        label="stacked"
        code={`<ProgressBar variant="stacked" segments={[
  { pct: 45, label: "done" },
  { pct: 20, label: "in progress" },
  { pct: 10, color: "#d50000", label: "failed" },
]} />`}
      >
        <div style={{ width: "16rem" }}>
          <ProgressBar
            variant="stacked"
            aria-label="Job breakdown"
            segments={[
              { pct: 45, label: "done" },
              { pct: 20, label: "in progress" },
              { pct: 10, color: "#d50000", label: "failed" },
            ]}
          />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="color override" code={`<ProgressBar variant="ring" pct={60} color="#d50000" />`}>
        <ProgressBar variant="ring" pct={60} color="#d50000" aria-label="Error state" />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof ProgressBarShowcase> = {
  title: "Feedbacks/ProgressBar",
  component: ProgressBarShowcase,
};

export default meta;
type Story = StoryObj<typeof ProgressBarShowcase>;

export const Showcase: Story = {
  render: () => <ProgressBarShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("ProgressBar")).toBeInTheDocument();

    const ring = canvas.getByRole("progressbar", { name: "Upload progress" });
    await expect(ring).toHaveAttribute("aria-valuenow", "42");

    const segmented = canvas.getByRole("progressbar", { name: "Step 3 of 5" });
    await expect(segmented).toHaveAttribute("aria-valuenow", "3");
    await expect(segmented).toHaveAttribute("aria-valuemax", "5");

    const indeterminate = canvas.getByRole("progressbar", { name: "Loading" });
    await expect(indeterminate).not.toHaveAttribute("aria-valuenow");

    const stacked = canvas.getByRole("progressbar", { name: "Job breakdown" });
    await expect(stacked).toHaveAttribute("aria-valuenow", "75");
  },
};
