import { Box, Heading, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import DataBox from '../../components/DataBox';
import { kickstarterProjects, kickstarterStats } from '../../myData';

interface Props {}

const Kickstarter = (props: Props) => {
  return (
    <>
      <Box border="1px solid white" p={6}>
        <Heading fontSize="md" mb={6}>
          📓 Statistics:
        </Heading>
        <Stack>
          {Object.keys(kickstarterStats).map(function (key, index) {
            return (
              <Stack isInline alignItems="center">
                <Text fontSize="sm">{key} =</Text>
                <Heading fontSize="md">{kickstarterStats[key]}</Heading>
              </Stack>
            );
          })}
        </Stack>
      </Box>
      {kickstarterProjects.map(proj => (
        <DataBox proj={proj} />
      ))}
    </>
  );
};

export default Kickstarter;
