import { Outlet } from "react-router-dom";
import { useState } from "react";

const RootLayout = () => {
  return (
    <div>
      <header>{/* Header content */}</header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

export default RootLayout;
