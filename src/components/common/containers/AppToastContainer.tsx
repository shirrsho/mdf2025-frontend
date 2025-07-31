import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AppToastContainer: React.FC = () => {
  return (
    <ToastContainer
      position='top-center'
      autoClose={1000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme='colored'
      transition={Slide}
    />
  );
};
