import React, { useState, useEffect } from 'react';

const UpdateItem = ({ item: initialItem, apiUri }) => {
  // Step 1: Initialize State
  const [item, setItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Step 2: API URI is received as a prop

  // Step 3: Fetch Existing Item
  useEffect(() => {
    // If initialItem is provided as a prop, use it
    if (initialItem) {
      setItem(initialItem);
      setUpdatedItem(initialItem);
      setLoading(false);
      return;
    }

    // Otherwise fetch it from the API
    const fetchItem = async () => {
      try {
        const response = await fetch(`${apiUri}/1`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        setItem(data);
        setUpdatedItem(data);
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    if (apiUri) {
      fetchItem();
    }
  }, [initialItem, apiUri]);

  // Step 6: Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Step 7: Create an Update Method
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiUri}/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      // Step 8: Handle API Response
      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      const updatedData = await response.json();
      setItem(updatedData);
      setUpdatedItem(updatedData);
      setSuccess('Item updated successfully!');
    } catch (err) {
      setError(`Error updating data: ${err.message}`);
      console.error("Error updating item:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !item) {
    return <div>Loading...</div>;
  }

  if (error && !item) {
    return <div className="error">{error}</div>;
  }

  // Step 4: Display Existing Item
  // Step 5: Create Input Fields
  return (
    <div className="update-item-container">
      <h2>Update Item</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {item && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedItem.name || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          
          {/* Dynamically generate form fields for each property */}
          {Object.keys(item).map(key => {
            // Skip the id field and any fields already handled
            if (key === 'id' || key === 'name') return null;
            
            return (
              <div className="form-group" key={key}>
                <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type={typeof item[key] === 'number' ? 'number' : 'text'}
                  id={key}
                  name={key}
                  value={updatedItem[key] || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            );
          })}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Item'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setUpdatedItem(item)}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      )}
      
      {/* Display original item for reference */}
      {item && (
        <div className="original-item">
          <h3>Original Item Data</h3>
          <pre>{JSON.stringify(item, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UpdateItem;