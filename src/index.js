import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css'
<<<<<<< HEAD

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./AuthConfig";



const msalInstance = new PublicClientApplication(msalConfig);

=======
>>>>>>> parent of 86259a1... Added HSE AD
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

