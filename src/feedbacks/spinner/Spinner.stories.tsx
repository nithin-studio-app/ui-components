import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Spinner } from "./Spinner";
import type { UploadItem } from "./Spinner";
import { Button } from "../../components/button";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function UploadDemo() {
  const [uploads, setUploads] = useState<UploadItem[] | null>(null);

  useEffect(() => {
    if (!uploads || !uploads.some((u) => u.status === "uploading")) return;
    const timer = setInterval(() => {
      setUploads((prev) => {
        if (!prev) return prev;
        const current = prev.find((u) => u.status === "uploading");
        if (!current) return prev;
        return prev.map((u) =>
          u.id === current.id
            ? u.progress >= 1
              ? { ...u, status: "done" as const, progress: 1 }
              : { ...u, progress: Math.min(1, u.progress + 0.34) }
            : u,
        );
      });
    }, 150);
    return () => clearInterval(timer);
  }, [uploads]);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() =>
          setUploads([
            { id: 1, name: "a.png", progress: 0, status: "uploading" },
            { id: 2, name: "b.png", progress: 0, status: "uploading" },
          ])
        }
      >
        Simulate upload
      </Button>
      {uploads && <Spinner uploads={uploads} onExited={() => setUploads(null)} />}
    </>
  );
}

function ErrorDemo() {
  const [uploads, setUploads] = useState<UploadItem[] | null>(null);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() =>
          setUploads([
            { id: 1, name: "a.png", progress: 1, status: "done" },
            { id: 2, name: "b.png", progress: 1, status: "error", error: "network error" },
          ])
        }
      >
        Simulate failed upload
      </Button>
      {uploads && <Spinner uploads={uploads} onExited={() => setUploads(null)} />}
    </>
  );
}

function SpinnerShowcase() {
  return (
    <ShowcasePage
      title="Spinner"
      description="A full-screen upload-progress overlay that celebrates on a clean finish, or dismisses itself after errors."
    >
      <ShowcaseCard
        label="in progress -> celebration"
        code={`<Spinner uploads={uploads} onExited={() => setUploads(null)} />`}
      >
        <UploadDemo />
      </ShowcaseCard>

      <ShowcaseCard label="with an error" code={`<Spinner uploads={uploadsWithError} onExited={dismiss} />`}>
        <ErrorDemo />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof SpinnerShowcase> = {
  title: "Feedbacks/Spinner",
  component: SpinnerShowcase,
};

export default meta;
type Story = StoryObj<typeof SpinnerShowcase>;

export const Showcase: Story = {
  render: () => <SpinnerShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await expect(canvas.getByText("Spinner")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Simulate upload" }));
    await expect(body.getByRole("status")).toHaveTextContent(/Uploading, \d+% complete/);

    await userEvent.click(canvas.getByRole("button", { name: "Simulate failed upload" }));
    await expect(body.getByText("1 of 2 uploads failed")).toBeInTheDocument();
  },
};
