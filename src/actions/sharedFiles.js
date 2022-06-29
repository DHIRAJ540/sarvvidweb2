import { SET_SHARED_ENTRY, SET_SHAREDHISTORY_ENTRY } from "../utils/constants";



export const updateSharedHistoryInfo = (entry) => {
  return {
    type: SET_SHAREDHISTORY_ENTRY,
    payload: entry.sharedHistory,
  };
};
