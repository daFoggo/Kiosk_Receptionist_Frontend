import "./App.css";
import router from "./router/router";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { WebSocketProvider } from "./context/WebSocketContext";
import { ipWebsocket } from "./utils/ip";
import { InteractionProvider } from "./context/InteractionContext";

function App() {
  return (
    <InteractionProvider>
      <WebSocketProvider webSocketUrl={ipWebsocket}>
        <RouterProvider router={router} />
      </WebSocketProvider>
    </InteractionProvider>
  );
}

export default App;
