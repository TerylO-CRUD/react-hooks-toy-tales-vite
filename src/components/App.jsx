import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const URL = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch(URL)
      .then((r) => r.json())
      .then(setToys);
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  function handleAddToy(newToy) {
    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newToy, likes: 0 }),
    })
      .then((r) => r.json())
      .then((savedToy) => setToys([...toys, savedToy]));
  }

  function handleDonate(id) {
    fetch(`${URL}/${id}`, { method: "DELETE" }).then(() =>
      setToys(toys.filter((toy) => toy.id !== id))
    );
  }

  function handleLike(toy) {
    fetch(`${URL}/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then((r) => r.json())
      .then((updated) =>
        setToys(toys.map((t) => (t.id === updated.id ? updated : t)))
      );
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onDonate={handleDonate} onLike={handleLike} />
    </>
  );
}

export default App;