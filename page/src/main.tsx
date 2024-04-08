import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import MenuProvider from "./providers/MenuProvider.tsx";
import SetupProvider from "./providers/SetupProvider.tsx";
import ForgeProvider from "./providers/ForgeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MenuProvider>
      <SetupProvider>
        <ForgeProvider>
          <App />
        </ForgeProvider>
      </SetupProvider>
    </MenuProvider>
  </React.StrictMode>
);
