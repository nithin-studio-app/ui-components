import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import * as icons from ".";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function IconsShowcase() {
  return (
    <ShowcasePage
      title="Icons"
      description="Plain SVG components, stroke/fill=currentColor — usable anywhere, styled by the parent."
    >
      <ShowcaseCard
        label={`all icons (${Object.keys(icons).length})`}
        code={`import { SearchIcon } from "@nithin22796/ui-components";

<SearchIcon />`}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", color: "#f0f0f0" }}>
          {Object.entries(icons).map(([name, Icon]) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "1.5rem", height: "1.5rem" }}>
                <Icon />
              </div>
              <span style={{ fontSize: "0.7rem", color: "#9aa0a6" }}>{name}</span>
            </div>
          ))}
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof IconsShowcase> = {
  title: "DataDisplay/Icons",
  component: IconsShowcase,
};

export default meta;
type Story = StoryObj<typeof IconsShowcase>;

export const AllIcons: Story = {
  render: () => <IconsShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Icons")).toBeInTheDocument();

    for (const name of Object.keys(icons)) {
      await expect(canvas.getByText(name)).toBeInTheDocument();
    }
  },
};
