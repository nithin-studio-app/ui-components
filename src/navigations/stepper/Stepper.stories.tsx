import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Stepper } from "./Stepper";
import { Text } from "../../data-display/text";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function BasicDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Stepper
      aria-label="Import wizard"
      activeIndex={activeIndex}
      onStepChange={setActiveIndex}
      steps={[
        { label: "Source", content: <Text>Pick a source.</Text> },
        { label: "Settings", content: <Text>Configure settings.</Text> },
        { label: "Review", content: <Text>Review and submit.</Text> },
      ]}
    />
  );
}

function LockedDemo() {
  const [activeIndex, setActiveIndex] = useState(1);
  return (
    <Stepper
      aria-label="Locked wizard"
      activeIndex={activeIndex}
      // furthestIndex defaults to activeIndex, so step 3 stays locked/dimmed
      // until the user actually reaches step 2 — going back doesn't unlock it.
      onStepChange={setActiveIndex}
      steps={[
        { label: "Source", content: <Text>Pick a source.</Text> },
        { label: "Settings", content: <Text>Configure settings.</Text> },
        { label: "Review", content: <Text>Review and submit — locked until you get here.</Text> },
      ]}
    />
  );
}

function StepperShowcase() {
  return (
    <ShowcasePage title="Stepper" description="A linear, multi-step flow — click a reachable step, or use Back/Next.">
      <ShowcaseCard
        label="basic"
        code={`<Stepper
  activeIndex={activeIndex}
  onStepChange={setActiveIndex}
  steps={[
    { label: "Source", content: <Text>Pick a source.</Text> },
    { label: "Settings", content: <Text>Configure settings.</Text> },
    { label: "Review", content: <Text>Review and submit.</Text> },
  ]}
/>`}
      >
        <BasicDemo />
      </ShowcaseCard>

      <ShowcaseCard
        label="locked steps (furthestIndex defaults to activeIndex)"
        code={`<Stepper activeIndex={1} onStepChange={setActiveIndex} steps={[...]} />`}
      >
        <LockedDemo />
      </ShowcaseCard>

      <ShowcaseCard label="hideNext (final step has its own action)" code={`<Stepper hideNext activeIndex={2} steps={[...]} />`}>
        <Stepper
          aria-label="Final step example"
          hideNext
          activeIndex={2}
          onStepChange={() => {}}
          steps={[
            { label: "Source", content: <Text>Pick a source.</Text> },
            { label: "Settings", content: <Text>Configure settings.</Text> },
            { label: "Review", content: <Text>The Next button is hidden here — this step has its own Submit action.</Text> },
          ]}
        />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof StepperShowcase> = {
  title: "Navigations/Stepper",
  component: StepperShowcase,
};

export default meta;
type Story = StoryObj<typeof StepperShowcase>;

export const Showcase: Story = {
  render: () => <StepperShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Stepper")).toBeInTheDocument();
    await expect(canvas.getByText("Pick a source.")).toBeInTheDocument();

    const importWizard = canvas.getByRole("navigation", { name: "Import wizard" });
    const sourceStepButton = within(importWizard).getByRole("button", { name: /Source/ });
    await expect(sourceStepButton.closest("li")).toHaveAttribute("aria-current", "step");

    const basicStepper = within(importWizard.closest(".stepper") as HTMLElement);
    await userEvent.click(basicStepper.getByRole("button", { name: /Next/ }));
    await expect(basicStepper.getByText("Configure settings.")).toBeInTheDocument();

    await userEvent.click(basicStepper.getByRole("button", { name: /Back/ }));
    await expect(basicStepper.getByText("Pick a source.")).toBeInTheDocument();

    // Locked steps: step 3 isn't reachable yet from step 2 (furthestIndex === activeIndex).
    const lockedWizard = canvas.getByRole("navigation", { name: "Locked wizard" });
    await expect(within(lockedWizard).getByRole("button", { name: /Review/ })).toBeDisabled();

    // The final step's own hideNext example has no visible Next button
    // (the nav only wraps the step timeline, not the Back/Next footer, so
    // scope up to the whole stepper container to check for its absence).
    const finalStepNav = canvas.getByRole("navigation", { name: "Final step example" });
    const finalStepContainer = finalStepNav.closest(".stepper") as HTMLElement;
    await expect(within(finalStepContainer).queryByRole("button", { name: /Next/ })).not.toBeInTheDocument();
  },
};
