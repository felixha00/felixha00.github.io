import React from 'react';
import {
  AspectRatio,
  Box,
  Text,
  Image,
  Heading,
  Link,
  Stack,
  IconButton,
  DarkMode,
} from '@chakra-ui/core';
import { RiLinksFill } from 'react-icons/ri';
import { usePalette } from 'react-palette';

interface Props {
  proj: any;
}

const DataBox = (props: Props) => {
  const { data, loading, error } = usePalette(props.proj.img);
  return (
    <>
      <Box
        boxShadow="xl"
        border="1px solid"
        borderColor="whiteAlpha.300"
        className="rounded"
        bg={`whiteAlpha.100`}
      >
        <Link fontSize="lg" href={props.proj.link} isExternal>
          <AspectRatio ratio={16 / 9} className="img-hover-zoom rounded">
            <Image src={props.proj.img}></Image>
          </AspectRatio>
        </Link>
        <Stack p={{ base: 4, lg: 8 }} spacing={{ base: 4, lg: 8 }}>
          <Stack isInline alignItems="center">
            {props.proj.link && (
              <DarkMode>
                <IconButton
                  aria-label="Link to Project"
                  as={Link}
                  color={data.lightVibrant || 'white'}
                  icon={<RiLinksFill />}
                  fontSize="md"
                  href={props.proj.link}
                  isRound
                  isExternal
                ></IconButton>
              </DarkMode>
            )}
            <Heading fontSize="lg" color={data.lightVibrant}>
              {props.proj.title}
              <span>
                <Text color="my.p" fontSize="sm" fontWeight="normal">
                  {props.proj.date}
                </Text>
              </span>
            </Heading>
          </Stack>

          {props.proj.text && props.proj.text.length > 0 && (
            <Stack spacing={4} h="100%">
              {props.proj.text &&
                props.proj.text.map(text => (
                  <Text color="whiteAlpha.700">‣ {text}</Text>
                ))}
            </Stack>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default DataBox;
