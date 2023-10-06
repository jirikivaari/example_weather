import React from 'react';
import { createRoot } from 'react-dom/client';
import Weather from './components/Weather';

/* global window */
/* eslint no-undef: "error" */
window.appStatus = false;

const updateStatus = () => {
  window.appStatus = true;
};

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Weather updateStatus={updateStatus} />);
