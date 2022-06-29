import { SET_SHARED_ENTRY, SET_SHAREDHISTORY_ENTRY } from "../utils/constants";

const sharedData = {
  sharedFiles: [],
  sharedHistory: [],
};

export default (state = sharedData, action) => {
  switch (action.type) {
    

    case SET_SHAREDHISTORY_ENTRY: {
      const newInfo = action.payload;
      console.log("reducer state...", state);

      return { ...state, sharedHistory: newInfo };
    }

    default:
      return state;
  }
};
