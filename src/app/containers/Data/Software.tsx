import React from 'react';
import DataBox from '../../components/DataBox';
import { softwareProjects } from '../../myData';

const Software = () => {
  return (
    <>
      {softwareProjects.map(proj => (
        <DataBox proj={proj} />
      ))}
    </>
  );
};

export default Software;
