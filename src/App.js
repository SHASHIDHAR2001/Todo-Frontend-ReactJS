import React from "react";
import Todo from "./components/Todo";
import { useRef, useState, useEffect } from "react";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const todoContentRef = useRef();

  function getItems() {
    setIsLoading(true);
    const url = "http://localhost:5000/api/v1/";
    fetch(url, {
      method: "GET"
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        const newList = [...response.todo_list];
        setIsLoading(false);
        setTodoList(newList);
      });
  }

  function submitHandler(event) {
    event.preventDefault();
    const contentInput = todoContentRef.current.value;
    const url = "http://localhost:5000/api/v1/";
    const addData = {
      title:contentInput
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addData)
    }).then((response) => {
        if(!response.ok) {
          alert('Add failed');
        } else {
          return response.json();
        }
    }).then(response => {
        event.target.reset();
        getItems();
    });
  }

  useEffect(getItems, []);

  return (
    <div>
      <h1>To Do Items</h1>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Type here to add ..."
          maxLength="100"
          required
          ref={todoContentRef}
        />
        <button className="btn">ADD</button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        todoList.map((item) => {
          return <Todo key={item.id} id={item.id} title={item.title} completed={item.completed} getItems={getItems}/>;
        })
      )}
    </div>
  );
}

export default App;