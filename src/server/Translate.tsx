import React from 'react';

import { serialize } from './index';

export default function Translate(props: React.PropsWithChildren) {
  return (
    <>
      {props.children}
      <textarea defaultValue={serialize()} />
    </>
  );
}
