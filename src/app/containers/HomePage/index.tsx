import { Box, Divider, Heading, Link, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { personalData } from '../../myData';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/core';
import Hardware from '../Data/Hardware';
import Software from '../Data/Software';
import Kickstarter from '../Data/Kickstarter';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <Box>
        <Stack spacing={3}>
          <Heading fontSize="2xl">Felix Ha</Heading>
          <Box>
            {Object.keys(personalData.links).map(key => (
              <Link
                _hover={{ color: 'white' }}
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
            <Divider mt={3}></Divider>
          </Box>
          <Text fontSize="sm">{personalData.intro}</Text>
          <Tabs fontSize="sm">
            <TabList mt={3} borderColor="transparent">
              {tabData.map((tab, index) => (
                <Tab
                  color="my.p"
                  mr={6}
                  pb={2}
                  pt={0}
                  pr={0}
                  pl={0}
                  _selected={{ borderColor: 'white', color: 'white' }}
                  fontSize="sm"
                  key={index}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {tabData.map((tab, index) => (
                <TabPanel p={0} mt={6} key={index}>
                  <Stack spacing={6}>{tab.content}</Stack>
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
    label: 'Software',
    content: <Software />,
  },
  {
    label: 'Hardware',
    content: <Hardware />,
  },
  {
    label: 'Kickstarters',
    content: <Kickstarter />,
  },
];
