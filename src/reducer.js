export const initialState = {
  user: null,
  recordsArr: [],
  verificationRequestsMeServicer: [],
  verificationRequestsMeRequestor: [],
  issuanceRequestsMeServicer: [],
  issuanceRequestsMeRequestor: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user };
    case "SET_USER_NULL":
      return initialState;
    case "SET_RECORDS":
      return { ...state, recordsArr: action.recordsArr };
    case "SET_RECORD_DETAILS":
      return { ...state, [action.recordName]: action.recordsDetails };
    case "SET_VERIFICATION_REQUESTS_ME_SERVICER":
      return {
        ...state,
        verificationRequestsMeServicer: action.verificationRequestsMeServicer,
      };
    case "SET_VERIFICATION_REQUESTS_ME_REQUESTOR":
      return {
        ...state,
        verificationRequestsMeRequestor: action.verificationRequestsMeRequestor,
      };
    case "SET_ISSUANCE_REQUESTS_ME_REQUESTOR":
      return {
        ...state,
        issuanceRequestsMeRequestor: action.issuanceRequestsMeRequestor,
      };
    case "SET_ISSUANCE_REQUESTS_ME_SERVICER":
      return {
        ...state,
        issuanceRequestsMeServicer: action.issuanceRequestsMeServicer,
      };
    default:
      return state;
  }
};

export default reducer;
