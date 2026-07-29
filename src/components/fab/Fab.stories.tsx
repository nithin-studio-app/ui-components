import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Fab } from "./Fab";
import { AddIcon, EditIcon, ChevronUpIcon } from "../../data-display/icons";
import { palette } from "../../foundations/colors";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function FabShowcase() {
  return (
    <ShowcasePage title="Fab" description="A circular button for a screen's single most prominent action.">
      <ShowcaseCard label="basic" code={`<Fab aria-label="Add"><AddIcon /></Fab>`}>
        <Fab aria-label="Add">
          <AddIcon />
        </Fab>
      </ShowcaseCard>

      <ShowcaseCard
        label="size"
        code={`<Fab size="small" aria-label="Add">…</Fab>\n<Fab size="medium" aria-label="Add">…</Fab>\n<Fab size="large" aria-label="Add">…</Fab>`}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Fab size="small" aria-label="Add small">
            <AddIcon />
          </Fab>
          <Fab size="medium" aria-label="Add medium">
            <AddIcon />
          </Fab>
          <Fab size="large" aria-label="Add large">
            <AddIcon />
          </Fab>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="color" code={`<Fab color={palette.red.A700} aria-label="Edit">…</Fab>`}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Fab color={palette.red.A700} aria-label="Edit danger">
            <EditIcon />
          </Fab>
          <Fab color={palette.green[800]} aria-label="Edit success">
            <EditIcon />
          </Fab>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="extended" code={`<Fab variant="extended"><AddIcon /> Create</Fab>`}>
        <Fab variant="extended">
          <AddIcon />
          Create
        </Fab>
      </ShowcaseCard>

      <ShowcaseCard label="disabled" code={`<Fab disabled aria-label="Add">…</Fab>`}>
        <Fab disabled aria-label="Add disabled">
          <AddIcon />
        </Fab>
      </ShowcaseCard>

      <ShowcaseCard label="link (href)" code={`<Fab href="https://example.com" aria-label="Scroll to top">…</Fab>`}>
        <Fab href="https://example.com" aria-label="Scroll to top">
          <ChevronUpIcon />
        </Fab>
      </ShowcaseCard>

      <ShowcaseCard label="click handler" code={`<Fab onClick={() => {}} aria-label="Add">…</Fab>`}>
        <Fab onClick={fn()} aria-label="Add clickable">
          <AddIcon />
        </Fab>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof FabShowcase> = {
  title: "Components/Fab",
  component: FabShowcase,
};

export default meta;
type Story = StoryObj<typeof FabShowcase>;

export const Showcase: Story = {
  render: () => <FabShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Fab")).toBeInTheDocument();

    const basic = canvas.getByRole("button", { name: "Add" });
    await expect(basic).toBeInTheDocument();

    const disabled = canvas.getByRole("button", { name: "Add disabled" });
    await expect(disabled).toBeDisabled();

    const link = canvas.getByRole("link", { name: "Scroll to top" });
    await expect(link).toHaveAttribute("href", "https://example.com");

    const extended = canvas.getByRole("button", { name: "Create" });
    await expect(extended).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Add clickable" }));
  },
};
