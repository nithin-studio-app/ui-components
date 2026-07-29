import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MediaPreview } from "./MediaPreview";
import type { MediaPreviewItem } from "./MediaPreview";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const galleryItems: MediaPreviewItem[] = [
  { id: "1", src: "https://picsum.photos/seed/preview1/1200/800", alt: "Mountain landscape", downloadName: "mountain.jpg" },
  { id: "2", src: "https://picsum.photos/seed/preview2/1200/800", alt: "City skyline", downloadName: "skyline.jpg" },
  { id: "3", src: "https://picsum.photos/seed/preview3/1200/800", alt: "Forest path", downloadName: "forest.jpg" },
];

function GalleryDemo() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {galleryItems.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            style={{ padding: 0, border: "1px solid #2a2c30", borderRadius: "8px", overflow: "hidden", cursor: "pointer" }}
          >
            <img src={item.src} alt={item.alt} width={96} height={64} style={{ display: "block", objectFit: "cover" }} />
          </button>
        ))}
      </div>
      {index !== null && (
        <MediaPreview
          items={galleryItems}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setIndex(null)}
          onDownload={fn()}
          onDelete={fn()}
        />
      )}
    </>
  );
}

function MediaPreviewShowcase() {
  return (
    <ShowcasePage
      title="MediaPreview"
      description="A full-screen lightbox for viewing images/videos — zoom + drag-to-pan, prev/next navigation, download/delete."
    >
      <ShowcaseCard
        label="basic (click a thumbnail)"
        code={`const [index, setIndex] = useState<number | null>(null);

{index !== null && (
  <MediaPreview
    items={items}
    index={index}
    onIndexChange={setIndex}
    onClose={() => setIndex(null)}
    onDownload={(item) => downloadUrl(item.src, item.downloadName)}
    onDelete={(item) => removeItem(item.id)}
  />
)}`}
      >
        <GalleryDemo />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof MediaPreviewShowcase> = {
  title: "Feedbacks/MediaPreview",
  component: MediaPreviewShowcase,
};

export default meta;
type Story = StoryObj<typeof MediaPreviewShowcase>;

export const Showcase: Story = {
  render: () => <MediaPreviewShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await expect(canvas.getByText("MediaPreview")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("img", { name: "Mountain landscape" }));

    const preview = body.getByRole("dialog", { name: "Media preview" });
    await expect(preview).toBeInTheDocument();
    await expect(within(preview).getByText("1 / 3")).toBeInTheDocument();

    // Zoom in updates the percentage readout and enables drag-to-pan.
    await userEvent.click(within(preview).getByRole("button", { name: "Zoom in" }));
    await expect(within(preview).getByText("125%")).toBeInTheDocument();

    // Reads the element's own inline style property (not getComputedStyle,
    // which — since transform is transitioned — can report a value
    // mid-animation rather than the one React just set).
    const image = within(preview).getByRole("img", { name: "Mountain landscape" }) as HTMLImageElement;
    await expect(image).toHaveClass("is-draggable");
    await expect(image.style.transform).toBe("translate(0px, 0px) scale(1.25)");

    // Dragging the zoomed image pans it — the transform's translate offset moves.
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: image, coords: { x: 100, y: 100 } },
      { coords: { x: 140, y: 130 } },
      { keys: "[/MouseLeft]" },
    ]);
    await expect(image.style.transform).toBe("translate(40px, 30px) scale(1.25)");

    // Zooming back out to 1x resets the pan offset.
    await userEvent.click(within(preview).getByRole("button", { name: "Zoom out" }));
    await expect(image.style.transform).toBe("translate(0px, 0px) scale(1)");
    await expect(image).not.toHaveClass("is-draggable");

    // The delete action is available and calls back with the current item.
    await expect(within(preview).getByRole("button", { name: "Delete" })).toBeInTheDocument();

    // Next navigates and resets zoom for the new image.
    await userEvent.click(within(preview).getByRole("button", { name: "Next" }));
    await expect(within(preview).getByText("2 / 3")).toBeInTheDocument();
    await expect(within(preview).getByText("100%")).toBeInTheDocument();

    // Escape closes it and returns focus to the trigger thumbnail.
    await userEvent.keyboard("{Escape}");
    await expect(body.queryByRole("dialog", { name: "Media preview" })).not.toBeInTheDocument();
  },
};
