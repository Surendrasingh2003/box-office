import { useEffect, useReducer, useState } from "react";
import { apiGet } from "./config";
function showsReducer(prevState, action) {
  switch (action.type) {
    case "ADD": {
      return [...prevState, action.showId];
    }
    case "REMOVE": {
      return prevState.filter((showId) => showId !== action.showId);
    }
    default:
      return prevState;
  }
}

function PersistedReducer(reducer, initialState, key) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    const persisted = localStorage.getItem(key);
    return persisted ? JSON.parse(persisted) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);
  return [state, dispatch];
}

export function useShows(key = "shows") {
  return PersistedReducer(showsReducer, [], key);
}

export function useLastQuery(key = "lastQuery") {
  const [input, setInput] = useState(() => {
    const persisted = sessionStorage.getItem(key);
    return persisted ? JSON.parse(persisted) : "";
  });

  const setPersistedInput = (newState) => {
    setInput(newState);
    sessionStorage.setItem(key, JSON.stringify(newState));
  };

  return [input, setPersistedInput];
}
const reducer = (prevState, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS": {
      return { isLoading: false, error: null, show: action.show };
    }
    case "FETCH_FAILURE": {
      return { ...prevState, isLoading: false, error: action.error };
    }
    default:
      return prevState;
  }
};
export function useShow(id) {
  const [state, dispatch] = useReducer(reducer, {
    show: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    apiGet(`/shows/${id}?embed[]=seasons&embed[]=cast`)
      .then((r) => r.json())
      .then((results) => {
        setTimeout(() => {
          dispatch({ type: "FETCH_SUCCESS", show: results });
        }, 2000);
      })
      .catch((err) => {
        dispatch({ type: "FETCH_FAILURE", err: err.message });
      });
  }, [id]);

  return state;
}
