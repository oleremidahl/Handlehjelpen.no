import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; 
import { AuthProvider } from "./provider/AuthProvider";
import { DataProvider } from "./provider/DataProvider";
import reportWebVitals from "./reportWebVitals";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
