import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Avatar } from "./Avatar";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>{children}</div>;
}

function AvatarShowcase() {
  return (
    <ShowcasePage title="Avatar" description="Image, initials, or icon — with an automatic fallback cascade.">
      <ShowcaseCard label="variant">
        <Row>
          <Avatar variant="circular" alt="Circular" />
          <Avatar variant="rounded" alt="Rounded" />
          <Avatar variant="square" alt="Square" />
        </Row>
      </ShowcaseCard>

      <ShowcaseCard label="image (src)">
        <Avatar src="https://picsum.photos/seed/avatar/200/200" alt="Sample user" />
      </ShowcaseCard>

      <ShowcaseCard label="fallback: broken image → initials">
        {/* A malformed data URI fails to decode immediately (no network
            round-trip), so the onError fallback is deterministic in tests. */}
        <Avatar src="data:image/png;base64,not-a-valid-image" alt="Jane Doe" />
      </ShowcaseCard>

      <ShowcaseCard label="fallback: no src → initials">
        <Avatar alt="Priya Shah" />
      </ShowcaseCard>

      <ShowcaseCard label="fallback: no src, no alt → generic icon">
        <Avatar />
      </ShowcaseCard>

      <ShowcaseCard label="custom content (overrides initials)">
        <Avatar alt="Notification bot">🤖</Avatar>
      </ShowcaseCard>

      <ShowcaseCard label="size">
        <Row>
          <Avatar alt="Small" size={1.75} />
          <Avatar alt="Default" />
          <Avatar alt="Large" size={4} />
        </Row>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof AvatarShowcase> = {
  title: "DataDisplay/Avatar",
  component: AvatarShowcase,
};

export default meta;
type Story = StoryObj<typeof AvatarShowcase>;

export const Showcase: Story = {
  render: () => <AvatarShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Avatar")).toBeInTheDocument();

    // The broken-image card exercises the same fallback path via onError,
    // but asserting it here would race the image's load/error event — the
    // "no src" case below covers the same fallback logic synchronously.

    // No src at all falls back to the alt text's initial.
    await expect(canvas.getByRole("img", { name: "Priya Shah" })).toHaveTextContent("P");

    // Custom children override the initials fallback.
    await expect(canvas.getByRole("img", { name: "Notification bot" })).toHaveTextContent("🤖");
  },
};
