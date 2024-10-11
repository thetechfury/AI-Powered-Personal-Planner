import React, { createContext, useContext, useEffect, useState } from 'react';
import {BASE_URL} from "./components/base_url/BaseUrl";

// Create a Context for the API
const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch((`${BASE_URL}/custom_user`), {
                    method: 'GET',
                    credentials: 'include',
                });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ApiContext.Provider value={{ users, loading, error }}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the ApiContext
export const useApi = () => {
  return useContext(ApiContext);
};
