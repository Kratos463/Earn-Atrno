"use client";

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export function Providers(props: {
  children: ReactNode;
}) {
 
  return (
    <Provider store={store}>
          {props.children}
    </Provider>
  );
}