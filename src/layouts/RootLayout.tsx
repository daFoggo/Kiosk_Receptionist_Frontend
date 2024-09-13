import { Outlet } from "react-router-dom";
import Header from "../components/Header";
const RootLayout = () => {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

export default RootLayout;
