import {
  Box,
  Divider,
  Heading,
  Link,
  Stack,
  Text,
  SimpleGrid,
  Image,
} from '@chakra-ui/core';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import {
  personalData,
  hardwareProjects,
  softwareProjects,
  kickstarterProjects,
} from '../../myData';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/core';
import Hardware from '../Data/Hardware';
import Software from '../Data/Software';
import Kickstarter from '../Data/Kickstarter';
import JSONPretty from 'react-json-pretty';
import Marquee from 'react-fast-marquee';
import NameLogo from '../../../assets/felix-ha-logo-white.svg';
var JSONPrettyMon = require('react-json-pretty/dist/1337');

export function HomePage() {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };
  return (
    <>
      <Helmet>
        <title>My Work</title>
        <meta name="description" content="My Work" />
      </Helmet>
      <Box>
        <Stack spacing={4}>
          <Stack pb={4}>
            <Image maxW="600px" src={NameLogo}></Image>
          </Stack>

          <Box>
            {Object.keys(personalData.links).map(key => (
              <Link
                _hover={{ marginLeft: '3px', color: 'white' }}
                color="my.p"
                display="block"
                w="fit-content"
                fontSize="md"
                href={personalData.links[key]}
                isExternal
              >
                {key}
              </Link>
            ))}
            <Divider mt={4}></Divider>
          </Box>
          <Text fontSize="sm">{personalData.intro}</Text>
          <Divider mt={4}></Divider>
          <Tabs onChange={handleTabChange} fontSize="sm" isLazy={false}>
            <TabList
              my={4}
              pb="2px"
              borderColor="transparent"
              overflowX="auto"
              overflowY="hidden"
            >
              {tabData.map((tab, index) => (
                <Tab
                  whiteSpace="nowrap"
                  color="my.p"
                  mr={6}
                  pb={2}
                  pt={0}
                  pr={0}
                  pl={0}
                  _hover={{ color: 'white' }}
                  _selected={{
                    borderColor: 'white',
                    color: 'white',
                    outline: 'none',
                  }}
                  fontSize="sm"
                  key={index}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
            <Box
              bg="black"
              position="sticky"
              top="0"
              zIndex="999"
              py={2}
              boxShadow="xl"
            >
              <Marquee gradient={false} style={{ overflow: 'hidden' }}>
                {[...Array(20).keys()].map(n => {
                  return (
                    <Heading key={n}>
                      {tabData[tabIndex].label.toUpperCase()} &nbsp;
                    </Heading>
                  );
                })}
              </Marquee>
            </Box>
            <TabPanels>
              {tabData.map((tab, index) => (
                <TabPanel p={0} mt={6} key={index}>
                  <Stack spacing={{ base: 4, lg: 8 }}>
                    <SimpleGrid
                      className="rounded"
                      overflowY="hidden"
                      columns={{ base: 1, lg: 2 }}
                      spacing={{ base: 4, lg: 8 }}
                    >
                      {tab.content}
                    </SimpleGrid>
                  </Stack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Stack>
      </Box>
    </>
  );
}

const tabData = [
  {
    label: '👨‍💻 Software',
    content: <Software />,
  },
  {
    label: '⚙️ Hardware',
    content: <Hardware />,
  },
  {
    label: '💵 Kickstarters',
    content: <Kickstarter />,
  },
  {
    label: '📄 Raw Data',
    content: (
      <JSONPretty
        mainStyle="padding:1em;"
        style={{ borderRadius: '20px' }}
        id="json-pretty"
        data={{
          personalData: { ...personalData },
          softwareProjects: { ...softwareProjects },
          hardwareProjects: { ...hardwareProjects },
          kickstarterProjects: { ...kickstarterProjects },
        }}
        theme={JSONPrettyMon}
      ></JSONPretty>
    ),
  },
];
