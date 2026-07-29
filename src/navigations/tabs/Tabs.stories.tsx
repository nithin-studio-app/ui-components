import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";
import { TabPanel } from "./TabPanel";
import { Text } from "../../data-display/text";
import { HomeIcon, SettingsIcon, PersonIcon } from "../../data-display/icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function BasicDemo() {
  const [value, setValue] = useState("one");
  return (
    <Tabs value={value} onChange={setValue} aria-label="Basic example">
      <Tab value="one" label="One" />
      <Tab value="two" label="Two" />
      <Tab value="three" label="Three" />
      <TabPanel value="one">
        <Text>Content for tab one.</Text>
      </TabPanel>
      <TabPanel value="two">
        <Text>Content for tab two.</Text>
      </TabPanel>
      <TabPanel value="three">
        <Text>Content for tab three.</Text>
      </TabPanel>
    </Tabs>
  );
}

function IconsDemo() {
  const [value, setValue] = useState("home");
  return (
    <Tabs value={value} onChange={setValue} aria-label="Icons example">
      <Tab value="home" label="Home" icon={<HomeIcon />} />
      <Tab value="profile" label="Profile" icon={<PersonIcon />} />
      <Tab value="settings" label="Settings" icon={<SettingsIcon />} />
      <TabPanel value="home">
        <Text>Home content.</Text>
      </TabPanel>
      <TabPanel value="profile">
        <Text>Profile content.</Text>
      </TabPanel>
      <TabPanel value="settings">
        <Text>Settings content.</Text>
      </TabPanel>
    </Tabs>
  );
}

function DisabledDemo() {
  const [value, setValue] = useState("one");
  return (
    <Tabs value={value} onChange={setValue} aria-label="Disabled example">
      <Tab value="one" label="One" />
      <Tab value="two" label="Two (disabled)" disabled />
      <Tab value="three" label="Three" />
      <TabPanel value="one">
        <Text>Content for tab one.</Text>
      </TabPanel>
      <TabPanel value="two">
        <Text>Content for tab two.</Text>
      </TabPanel>
      <TabPanel value="three">
        <Text>Content for tab three.</Text>
      </TabPanel>
    </Tabs>
  );
}

function TabsShowcase() {
  return (
    <ShowcasePage title="Tabs" description="Switches between views without leaving the page, via role=tablist/tab/tabpanel.">
      <ShowcaseCard
        label="basic"
        code={`<Tabs value={value} onChange={setValue}>
  <Tab value="one" label="One" />
  <Tab value="two" label="Two" />
  <Tab value="three" label="Three" />
  <TabPanel value="one">Content for tab one.</TabPanel>
  <TabPanel value="two">Content for tab two.</TabPanel>
  <TabPanel value="three">Content for tab three.</TabPanel>
</Tabs>`}
      >
        <BasicDemo />
      </ShowcaseCard>

      <ShowcaseCard label="with icons" code={`<Tab value="home" label="Home" icon={<HomeIcon />} />`}>
        <IconsDemo />
      </ShowcaseCard>

      <ShowcaseCard label="disabled tab" code={`<Tab value="two" label="Two" disabled />`}>
        <DisabledDemo />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof TabsShowcase> = {
  title: "Navigations/Tabs",
  component: TabsShowcase,
};

export default meta;
type Story = StoryObj<typeof TabsShowcase>;

export const Showcase: Story = {
  render: () => <TabsShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Tabs")).toBeInTheDocument();

    const basicList = canvas.getByRole("tablist", { name: "Basic example" });
    const basicDemo = within(basicList.parentElement as HTMLElement);
    const tabOne = within(basicList).getByRole("tab", { name: "One" });
    const tabTwo = within(basicList).getByRole("tab", { name: "Two" });
    await expect(tabOne).toHaveAttribute("aria-selected", "true");
    await expect(basicDemo.getByText("Content for tab one.")).toBeInTheDocument();

    // Clicking a tab switches the panel and updates aria-selected/roving tabindex.
    await userEvent.click(tabTwo);
    await expect(tabTwo).toHaveAttribute("aria-selected", "true");
    await expect(tabOne).toHaveAttribute("tabindex", "-1");
    await expect(basicDemo.getByText("Content for tab two.")).toBeInTheDocument();
    await expect(basicDemo.queryByText("Content for tab one.")).not.toBeInTheDocument();

    // Arrow keys move focus and activate the next tab.
    tabTwo.focus();
    await userEvent.keyboard("{ArrowRight}");
    const tabThree = within(basicList).getByRole("tab", { name: "Three" });
    await expect(tabThree).toHaveFocus();
    await expect(tabThree).toHaveAttribute("aria-selected", "true");

    // Disabled tabs are skipped, not selectable.
    const disabledList = canvas.getByRole("tablist", { name: "Disabled example" });
    await expect(within(disabledList).getByRole("tab", { name: "Two (disabled)" })).toBeDisabled();
  },
};
