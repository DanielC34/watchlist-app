import { useState } from "react";
import Today from "./Today";
import Week from "./Week";
import { TabList, Tabs, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";

const ToggleSwitch = () => {

  return (
    <Box>
      <Tabs size="md" variant="soft-rounded">
        <TabList>
          <Tab>Today</Tab>
          <Tab>This Week</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Today />
          </TabPanel>
          <TabPanel>
            <Week />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ToggleSwitch;
