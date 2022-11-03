import React from 'react';
import DataBox from '../../components/DataBox';
import { hardwareProjects } from '../../myData';

const Hardware = () => {
  return (
    <>
      {hardwareProjects.map(proj => (
        <DataBox proj={proj} />
      ))}
    </>
  );
};

export default Hardware;
