"use client";

import { getAuthToken, logout } from "../../../utils/authHelpers";

export default function dashboard() {
  const token = getAuthToken();
  function handleClick() {
    logout();
  }

  return (
    <>
      <div>Hello dashboard {token} XD</div>
      <div>{token}</div>
      <button onClick={handleClick}>Logout</button>
    </>
  );
}
