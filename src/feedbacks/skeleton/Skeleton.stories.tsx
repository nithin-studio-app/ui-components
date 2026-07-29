import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Skeleton } from "./Skeleton";
import { Card, CardContent } from "../../data-display/card";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function SkeletonShowcase() {
  return (
    <ShowcasePage title="Skeleton" description="A placeholder shape shown while real content is still loading.">
      <ShowcaseCard
        label="variant"
        code={`<Skeleton variant="text" width={160} />
<Skeleton variant="circular" />
<Skeleton variant="rectangular" width={160} height={80} />
<Skeleton variant="rounded" width={160} height={80} />`}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Skeleton variant="text" width={160} />
          <Skeleton variant="circular" />
          <Skeleton variant="rectangular" width={160} height={80} />
          <Skeleton variant="rounded" width={160} height={80} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="animation: wave" code={`<Skeleton animation="wave" width={200} />`}>
        <Skeleton animation="wave" width={200} />
      </ShowcaseCard>

      <ShowcaseCard label="animation: none" code={`<Skeleton animation={false} width={200} />`}>
        <Skeleton animation={false} width={200} />
      </ShowcaseCard>

      <ShowcaseCard
        label="composed (a loading Card)"
        code={`<Card>
  <CardContent>
    <Skeleton variant="circular" />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="rounded" height={120} />
  </CardContent>
</Card>`}
      >
        <div style={{ width: "16rem" }}>
          <Card>
            <CardContent>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <Skeleton variant="circular" />
                <div style={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
              <Skeleton variant="rounded" height={120} />
            </CardContent>
          </Card>
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof SkeletonShowcase> = {
  title: "Feedbacks/Skeleton",
  component: SkeletonShowcase,
};

export default meta;
type Story = StoryObj<typeof SkeletonShowcase>;

export const Showcase: Story = {
  render: () => <SkeletonShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Skeleton")).toBeInTheDocument();

    const skeletons = canvasElement.querySelectorAll(".skeleton");
    await expect(skeletons.length).toBeGreaterThan(5);

    // Decorative — hidden from assistive tech.
    for (const skeleton of skeletons) {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    }
  },
};
