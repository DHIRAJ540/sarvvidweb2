import {
  SET_DELETE_LOADING,
  SET_UPLOAD_LOADING,
  SET_DOWNLOAD_LOADING,
} from "../utils/constants";

const initialState = {
  deleteLoading: false,
  uploadLoading: false,
  downloadLoading: false,
};

export default (data = initialState, action) => {
  switch (action.type) {
    case SET_DELETE_LOADING: {
      console.log("loader reducer...", action);
      return {
        ...data,
        deleteLoading: action.payload,
      };
    }
    case SET_UPLOAD_LOADING: {
      return {
        ...data,
        uploadLoading: action.payload,
      };
    }
    case SET_DOWNLOAD_LOADING: {
      return {
        ...data,
        downloadLoading: action.payload,
      };
    }
    default: {
      return data;
    }
  }
};
