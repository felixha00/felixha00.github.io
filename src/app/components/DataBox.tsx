import React from 'react';
import {
  AspectRatio,
  Box,
  Container,
  Text,
  Image,
  Heading,
  Link,
  Stack,
} from '@chakra-ui/core';

interface Props {
  proj: any;
}

const DataBox = (props: Props) => {
  console.log(props);
  return (
    <>
      <Box border="1px solid white">
        <Link fontSize="lg" href={props.proj.link} isExternal>
          <AspectRatio ratio={16 / 9}>
            <Image src={props.proj.img}></Image>
          </AspectRatio>
        </Link>
        <Box p={3}>
          <Stack isInline alignItems="center">
            {props.proj.link && (
              <Link
                border="1px solid white"
                p={1}
                fontSize="md"
                href={props.proj.link}
                isExternal
              >
                🔗
              </Link>
            )}
            <Heading fontSize="md">
              {props.proj.title}
              <span>
                {' '}
                <Text color="my.p" fontSize="sm" fontWeight="normal">
                  {props.proj.date}
                </Text>
              </span>
            </Heading>
          </Stack>

          {props.proj.text && (
            <Stack pt={3} spacing={3}>
              {props.proj.text &&
                props.proj.text.map(text => (
                  <Text color="#e2e2e2">‣ {text}</Text>
                ))}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default DataBox;
