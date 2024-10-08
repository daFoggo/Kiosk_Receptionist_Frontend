import "./App.css";
import router from "./router/router";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import StateTestComponent from "./components/StateTest";

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
