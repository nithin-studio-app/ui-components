import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Card, CardHeader, CardMedia, CardContent, CardActions } from "./Card";
import { Avatar } from "../avatar";
import { Text } from "../text";
import { Button } from "../../components/button";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function CardShowcaseComponent() {
  return (
    <ShowcasePage title="Card" description="A bordered/elevated surface for grouping related content — header, media, body, actions.">
      <ShowcaseCard
        label="full composition"
        code={`<Card>
  <CardHeader avatar={<Avatar alt="Jane Doe" />} title="Jane Doe" subheader="2 hours ago" />
  <CardMedia src="…" alt="A snowy path" height={10} />
  <CardContent>
    <Text>A short caption describing the photo.</Text>
  </CardContent>
  <CardActions>
    <Button variant="text">Share</Button>
    <Button variant="text">Save</Button>
  </CardActions>
</Card>`}
      >
        <div style={{ width: "18rem" }}>
          <Card>
            <CardHeader avatar={<Avatar alt="Jane Doe" />} title="Jane Doe" subheader="2 hours ago" />
            <CardMedia src="https://picsum.photos/seed/card1/600/400" alt="A snowy path" height={10} />
            <CardContent>
              <Text>A short caption describing the photo.</Text>
            </CardContent>
            <CardActions>
              <Button variant="text" onClick={fn()}>
                Share
              </Button>
              <Button variant="text" onClick={fn()}>
                Save
              </Button>
            </CardActions>
          </Card>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="variant: outlined" code={`<Card variant="outlined">…</Card>`}>
        <div style={{ width: "16rem" }}>
          <Card variant="outlined">
            <CardContent>
              <Text>An outlined card — border instead of a shadow.</Text>
            </CardContent>
          </Card>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="content only" code={`<Card><CardContent>…</CardContent></Card>`}>
        <div style={{ width: "16rem" }}>
          <Card>
            <CardContent>
              <Text>Just a CardContent — no header, media, or actions needed.</Text>
            </CardContent>
          </Card>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="clickable (onClick)" code={`<Card onClick={() => {}}><CardMedia src="…" /><CardContent>…</CardContent></Card>`}>
        <div style={{ width: "16rem" }}>
          <Card onClick={fn()}>
            <CardMedia src="https://picsum.photos/seed/card2/600/400" alt="Mountain range" height={8} />
            <CardContent>
              <Text>The whole card is clickable — try tabbing to it.</Text>
            </CardContent>
          </Card>
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof CardShowcaseComponent> = {
  title: "DataDisplay/Card",
  component: CardShowcaseComponent,
};

export default meta;
type Story = StoryObj<typeof CardShowcaseComponent>;

export const Showcase: Story = {
  render: () => <CardShowcaseComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Card")).toBeInTheDocument();
    await expect(canvas.getByText("Jane Doe")).toBeInTheDocument();
    await expect(canvas.getByText("2 hours ago")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Share" }));

    const clickableCard = canvas.getByRole("button", { name: /The whole card is clickable/ });
    await userEvent.click(clickableCard);
    await expect(clickableCard).toHaveFocus();
  },
};
