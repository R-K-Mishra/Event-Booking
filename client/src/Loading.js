import React from 'react';

import { loaderUrl } from './constants';

const Loading = () => {
  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
      <img src={loaderUrl} alt='Loading...' />
    </div>
  )
}

export default Loading;