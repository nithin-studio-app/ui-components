import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Marquee } from "./Marquee";
import { Avatar } from "../avatar";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const items = ["frame-extractor", "filezilla", "lora-trainer", "image-upscaler"];

function ItemList() {
  return (
    <>
      {items.map((name) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0" }}>
          <Avatar alt={name} size={2} />
          <span>{name}</span>
        </div>
      ))}
    </>
  );
}

function ImageRow() {
  return (
    <>
      {[1, 2, 3, 4].map((seed) => (
        <img
          key={seed}
          src={`https://picsum.photos/seed/marquee${seed}/160/120`}
          alt=""
          style={{ height: "7.5rem", width: "10rem", objectFit: "cover", borderRadius: "8px", marginRight: "1rem" }}
        />
      ))}
    </>
  );
}

function MarqueeShowcase() {
  return (
    <ShowcasePage
      title="Marquee"
      description="Loops its children in a continuous scroll — pass the list once, Marquee repeats it enough to stay buffered. Content is unrestricted: text, images, or a mix. Ships with its own container chrome (border, background, padding) and a height/width prop, so no wrapper div is needed."
    >
      <ShowcaseCard
        label="direction: up (default) — text + avatar"
        code={`<Marquee height="16rem" width="14rem">
  <ItemList />
</Marquee>`}
      >
        <Marquee height="16rem" width="14rem">
          <ItemList />
        </Marquee>
      </ShowcaseCard>

      <ShowcaseCard
        label="direction: down"
        code={`<Marquee direction="down" height="16rem" width="14rem">\n  <ItemList />\n</Marquee>`}
      >
        <Marquee direction="down" height="16rem" width="14rem">
          <ItemList />
        </Marquee>
      </ShowcaseCard>

      <ShowcaseCard
        label="direction: left — images"
        code={`<Marquee direction="left" height="9rem" width="100%">
  <ImageRow />
</Marquee>`}
      >
        <Marquee direction="left" height="9rem" width="100%">
          <ImageRow />
        </Marquee>
      </ShowcaseCard>

      <ShowcaseCard
        label="direction: right"
        code={`<Marquee direction="right" height="9rem" width="100%">\n  <ImageRow />\n</Marquee>`}
      >
        <Marquee direction="right" height="9rem" width="100%">
          <ImageRow />
        </Marquee>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof MarqueeShowcase> = {
  title: "DataDisplay/Marquee",
  component: MarqueeShowcase,
};

export default meta;
type Story = StoryObj<typeof MarqueeShowcase>;

export const Showcase: Story = {
  render: () => <MarqueeShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Marquee")).toBeInTheDocument();
    await expect(canvas.getAllByText("filezilla").length).toBeGreaterThan(0);
  },
};
