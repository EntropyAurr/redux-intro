import { useDispatch, useSelector } from "react-redux";
import { updateName } from "./customerSlice";
import { useState } from "react";

function Customer() {
  const customer = useSelector((store) => store.customer.fullName);

  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");

  function handleRename() {
    dispatch(updateName(fullName));
    setFullName("");
  }

  return (
    <>
      <h2>👋 Welcome, {customer}</h2>
      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <button onClick={handleRename}>Rename</button>
    </>
  );
}

export default Customer;
