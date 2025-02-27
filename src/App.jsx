import React, { useState, useEffect } from 'react';
import UpdateItem from "./components/UpdateItem";

// use the following link to get the data
// `/doors` will give you all the doors, to get a specific door use `/doors/1`.
const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

function App() {
  // Get the existing item from the server
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URI}/1`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, []);
  
  // pass the item to UpdateItem as a prop
  return (
    <div className="container">
      <h1>Item Update Form</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <UpdateItem item={item} apiUri={API_URI} />
      )}
    </div>
  );
}

export default App;