import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },

      // the object return from prepare() method used as the payload for the action creator with more than 1 argument
      reducer(state, action) {
        if (state.loan > 0) return;

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance += action.payload.amount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;

const KEY = "99b81557e63a57d5f0defe33";

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch) {
    dispatch({ type: "account/convertingCurrency" });

    const res = await fetch(`https://v6.exchangerate-api.com/v6/${KEY}/latest/${currency}`);
    const data = await res.json();
    const converted = data.conversion_rates["USD"] * amount;

    dispatch({ type: "account/deposit", payload: converted });
  };
}

/* 
export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload, isLoading: false };

    case "account/convertingCurrency":
      return { ...state, isLoading: true };

    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };

    case "account/requestLoan":
      if (state.loan > 0) return state;
      return { ...state, loan: action.payload.amount, loanPurpose: action.payload.purpose, balance: state.balance + action.payload.amount };

    case "account/payLoan":
      return { ...state, loan: 0, loanPurpose: "", balance: state.balance - state.loan };

    default:
      return state;
  }
}


export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });

    const res = await fetch(`https://v6.exchangerate-api.com/v6/${KEY}/latest/${currency}`);
    const data = await res.json();
    const converted = data.conversion_rates["USD"] * amount;

    dispatch({ type: "account/deposit", payload: converted });
  };
}

export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount,
      purpose,
    },
  };
}

export function payLoan() {
  return { type: "account/payLoan" };
}
 */
