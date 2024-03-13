import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <header>
        <h1>Welcome to AutoSentry</h1>
      </header>
      <main>
        <p>
          AutoSentry is a web application designed to assist vehicle owners in managing and tracking their vehicle's maintenance activities effectively. The primary goal of this project is to provide users with a platform where they can monitor their vehicle's maintenance schedule, track service history, receive reminders for upcoming maintenance tasks, and optimize their vehicle's performance and longevity.
        </p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Click me! Count is {count}
          </button>
        </div>
      </main>
      <footer>
        <p> 2024 AutoSentry.</p>
      </footer>
    </div>
  );
}

export default App;
