import { Box, Heading, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import DataBox from '../../components/DataBox';
import { kickstarterProjects, kickstarterStats } from '../../myData';

const Kickstarter = () => {
  return (
    <>
      <Box
        boxShadow="xl"
        border="1px solid"
        borderColor="whiteAlpha.300"
        className="rounded"
        bg="whiteAlpha.50"
        p={{ base: 4, lg: 8 }}
      >
        <Heading fontSize="md" mb={6}>
          <span role="img" aria-label="Kickstarter Statistics">
            📓
          </span>{' '}
          Statistics:
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
