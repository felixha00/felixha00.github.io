import React from 'react';
import DataBox from '../../components/DataBox';
import { hardwareProjects } from '../../myData';

interface Props {}

const Hardware = (props: Props) => {
  return (
    <>
      {hardwareProjects.map(proj => (
        <DataBox proj={proj} />
      ))}
    </>
  );
};

export default Hardware;
