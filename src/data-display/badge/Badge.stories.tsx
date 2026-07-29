import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge } from "./Badge";
import { NotificationsIcon, MailIcon } from "../icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function IconBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "8px",
        background: "#3a3d42",
        color: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "1.25rem", height: "1.25rem" }}>{children}</div>
    </div>
  );
}

function BadgeShowcase() {
  return (
    <ShowcasePage title="Badge" description="A count or dot anchored to a corner of another element.">
      <ShowcaseCard
        label="count"
        code={`<Badge content={3}>
  <NotificationsIcon />
</Badge>`}
      >
        <Badge content={3}>
          <IconBox>
            <NotificationsIcon />
          </IconBox>
        </Badge>
      </ShowcaseCard>

      <ShowcaseCard
        label="dot"
        code={`<Badge variant="dot">
  <NotificationsIcon />
</Badge>`}
      >
        <Badge variant="dot">
          <IconBox>
            <NotificationsIcon />
          </IconBox>
        </Badge>
      </ShowcaseCard>

      <ShowcaseCard
        label="max truncation (content=125, max=99)"
        code={`<Badge content={125}>
  <MailIcon />
</Badge>`}
      >
        <Badge content={125}>
          <IconBox>
            <MailIcon />
          </IconBox>
        </Badge>
      </ShowcaseCard>

      <ShowcaseCard
        label="showZero"
        code={`<Badge content={0}>
  <MailIcon />
</Badge>
<Badge content={0} showZero>
  <MailIcon />
</Badge>`}
      >
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Badge content={0}>
            <IconBox>
              <MailIcon />
            </IconBox>
          </Badge>
          <Badge content={0} showZero>
            <IconBox>
              <MailIcon />
            </IconBox>
          </Badge>
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="invisible"
        code={`<Badge content={5} invisible>
  <NotificationsIcon />
</Badge>`}
      >
        <Badge content={5} invisible>
          <IconBox>
            <NotificationsIcon />
          </IconBox>
        </Badge>
      </ShowcaseCard>

      <ShowcaseCard
        label="color"
        code={`<Badge content={2} color="#d50000">
  <MailIcon />
</Badge>
<Badge content={2} color="#64dd17">
  <NotificationsIcon />
</Badge>`}
      >
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Badge content={2} color="#d50000">
            <IconBox>
              <MailIcon />
            </IconBox>
          </Badge>
          <Badge content={2} color="#64dd17">
            <IconBox>
              <NotificationsIcon />
            </IconBox>
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
