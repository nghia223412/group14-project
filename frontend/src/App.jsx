import React, { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUserAdded = () => setRefresh(!refresh);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý người dùng - Frontend</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList key={refresh} />
    </div>
  );
}

export default App;
