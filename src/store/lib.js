export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

export function mutate(state, action) {
  if (action.payload) {
    Object.entries(action.payload).map(([key, value]) => (state[key] = value));
    return { ...state };
  }
  return state;
}

export function set(state, action) {
  if (action.payload) {
    const values = Object.values(action.payload);
    if (values.length === 1) {
      return values[0];
    } else {
      console.error(values);
    }
  }
  return state;
}

export function push(state, action) {
  if (action.payload) {
    const values = Object.values(action.payload);
    if (values.length === 1) {
      return state.concat(values[0]);
    } else {
      console.error(values);
    }
  }
  return state;
}

export function deleteById(state, action) {
  if (action.payload) {
    const [[key, value]] = Object.entries(action.payload);
    const index = state.findIndex(p => p[key] === value);
    // console.warn(index);
    if (index > -1) {
      // console.warn(state.length);
      state.splice(index, 1);
      // console.warn(state.length);
      return [...state];
    }
  }
  return state;
}
