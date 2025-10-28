import React from "react";
import UserList from "./components/UserList";

function App() {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Quản lý người dùng - Frontend</h1>
      <UserList />
    </div>
  );
}

export default App;
