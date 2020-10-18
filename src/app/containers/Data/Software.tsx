import React from 'react';
import DataBox from '../../components/DataBox';
import { softwareProjects } from '../../myData';

interface Props {}

const Software = (props: Props) => {
  return (
    <>
      {softwareProjects.map(proj => (
        <DataBox proj={proj} />
      ))}
    </>
  );
};

export default Software;
