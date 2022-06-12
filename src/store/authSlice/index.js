import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  token: localStorage.getItem("@token@") ?? "",
  expiresIn: JSON.parse(localStorage.getItem("@expiration@")) ?? null,
  isLoggedIn: !!localStorage.getItem("@token@") ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setAuthState(state, action) {
      state.token = action.payload.idToken;
      localStorage.setItem("@token@", action.payload.idToken);

      state.isLoggedIn = true;

      state.expiresIn = new Date(
        new Date().getTime() + +action.payload.expiresIn * 1000
      ).toISOString();
      localStorage.setItem("@expiration@", JSON.stringify(state.expiresIn));
    },
    logout(state) {
      state.token = "";
      state.isLoggedIn = false;
      localStorage.removeItem("@token@");
      localStorage.removeItem("@expiration@");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
