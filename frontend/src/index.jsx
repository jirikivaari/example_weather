import React from 'react';
import ReactDOM from 'react-dom';
import Weather from './components/Weather';

/* global window */
/* eslint no-undef: "error" */
window.appStatus = false;

const updateStatus = () => {
  window.appStatus = true;
};

ReactDOM.render(
  <Weather updateStatus={updateStatus} />,
  document.getElementById('app'),
);
