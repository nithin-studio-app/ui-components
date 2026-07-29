import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ImageCarousel } from "./ImageCarousel";
import type { CarouselItem } from "./ImageCarousel";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const scenicItems: CarouselItem[] = [
  { id: "1", src: "https://picsum.photos/seed/carousel1/900/500", alt: "Mountain lake" },
  { id: "2", src: "https://picsum.photos/seed/carousel2/900/500", alt: "Desert dunes" },
  { id: "3", src: "https://picsum.photos/seed/carousel3/900/500", alt: "Coastal cliffs" },
];

const captionedItems: CarouselItem[] = [
  { id: "1", src: "https://picsum.photos/seed/carousel4/900/500", alt: "City at night", caption: "Downtown, 11pm." },
  { id: "2", src: "https://picsum.photos/seed/carousel5/900/500", alt: "Empty street", caption: "Early morning fog." },
];

function ImageCarouselShowcase() {
  return (
    <ShowcasePage title="ImageCarousel" description="A sliding image gallery — arrows, dots, optional autoplay with a required pause control.">
      <ShowcaseCard
        label="basic"
        code={`<ImageCarousel
  aria-label="Scenic photos"
  items={[
    { id: "1", src: "…", alt: "Mountain lake" },
    { id: "2", src: "…", alt: "Desert dunes" },
    { id: "3", src: "…", alt: "Coastal cliffs" },
  ]}
/>`}
      >
        <ImageCarousel aria-label="Scenic photos" items={scenicItems} height={16} />
      </ShowcaseCard>

      <ShowcaseCard label="with captions" code={`<ImageCarousel items={[{ id: "1", src: "…", caption: "Downtown, 11pm." }, ...]} />`}>
        <ImageCarousel aria-label="Captioned photos" items={captionedItems} height={16} />
      </ShowcaseCard>

      <ShowcaseCard
        label="autoPlay (always ships a pause control)"
        code={`<ImageCarousel autoPlay interval={4000} items={items} />`}
      >
        <ImageCarousel aria-label="Autoplaying photos" items={scenicItems} autoPlay interval={4000} height={16} />
      </ShowcaseCard>

      <ShowcaseCard label="no arrows/dots" code={`<ImageCarousel showArrows={false} showDots={false} items={items} />`}>
        <ImageCarousel aria-label="Minimal photos" items={scenicItems} showArrows={false} showDots={false} height={12} />
      </ShowcaseCard>

      <ShowcaseCard
        label="autoPlay, pause button hidden (hover/focus-pause instead)"
        code={`<ImageCarousel autoPlay showPlayPauseButton={false} items={items} />`}
      >
        <ImageCarousel
          aria-label="Autoplaying without a pause button"
          items={scenicItems}
          autoPlay
          interval={150}
          showPlayPauseButton={false}
          height={12}
        />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof ImageCarouselShowcase> = {
  title: "DataDisplay/ImageCarousel",
  component: ImageCarouselShowcase,
};

export default meta;
type Story = StoryObj<typeof ImageCarouselShowcase>;

export const Showcase: Story = {
  render: () => <ImageCarouselShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("ImageCarousel")).toBeInTheDocument();

    // aria-hidden="true" elements have no computed accessible name (per
    // spec, being aria-hidden removes them from the tree), so name-based
    // getByRole queries can't target the off-screen slides — a plain
    // querySelectorAll on slide position works regardless.
    const basic = canvas.getByRole("region", { name: "Scenic photos" });
    const basicSlides = basic.querySelectorAll(".carousel-slide");
    await expect(within(basic).getByRole("group", { name: "1 of 3" })).toHaveAttribute("aria-hidden", "false");
    await expect(basicSlides[1]).toHaveAttribute("aria-hidden", "true");

    // The next arrow advances the slide and updates the active dot.
    await userEvent.click(within(basic).getByRole("button", { name: "Next slide" }));
    await expect(within(basic).getByRole("group", { name: "2 of 3" })).toHaveAttribute("aria-hidden", "false");
    await expect(within(basic).getByRole("button", { name: "Go to slide 2" })).toHaveAttribute("aria-current", "true");

    // Clicking a dot jumps straight to that slide.
    await userEvent.click(within(basic).getByRole("button", { name: "Go to slide 3" }));
    await expect(within(basic).getByRole("group", { name: "3 of 3" })).toHaveAttribute("aria-hidden", "false");

    // Autoplay ships a Pause control (required so keyboard users can stop it, not just hover).
    const autoplay = canvas.getByRole("region", { name: "Autoplaying photos" });
    const pauseButton = within(autoplay).getByRole("button", { name: "Pause" });
    await expect(pauseButton).toBeInTheDocument();
    await userEvent.click(pauseButton);
    await expect(within(autoplay).getByRole("button", { name: "Play" })).toBeInTheDocument();

    // Minimal mode has no arrows/dots.
    const minimal = canvas.getByRole("region", { name: "Minimal photos" });
    await expect(within(minimal).queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
    await expect(within(minimal).queryByRole("button", { name: "Go to slide 1" })).not.toBeInTheDocument();

    // With the button hidden, hovering pauses it instead — no pause
    // control at all. This carousel has been autoplaying since the story
    // mounted (long before this point in the test), so its active slide
    // isn't necessarily index 0 — capture whichever one is active right
    // now rather than assuming, then confirm it's still the same one
    // after hovering and waiting well past the 150ms interval.
    const noButton = canvas.getByRole("region", { name: "Autoplaying without a pause button" });
    await expect(within(noButton).queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
    function activeSlideIndex() {
      const slides = Array.from(noButton.querySelectorAll(".carousel-slide"));
      return slides.findIndex((slide) => slide.getAttribute("aria-hidden") === "false");
    }

    await userEvent.hover(noButton);
    const pausedAt = activeSlideIndex();
    await new Promise((resolve) => setTimeout(resolve, 700));
    await expect(activeSlideIndex()).toBe(pausedAt);

    // Unhovering resumes it — the active slide moves on.
    await userEvent.unhover(noButton);
    await new Promise((resolve) => setTimeout(resolve, 700));
    await expect(activeSlideIndex()).not.toBe(pausedAt);
  },
};
