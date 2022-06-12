import { Route, Routes, Navigate } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import { useSelector, useDispatch } from "react-redux";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { authActions } from "./store/authSlice";

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjExpirationTime - currentTime;

  return remainingTime;
};

function App() {
  const authReducer = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authReducer.expiresIn) {
      return;
    }

    let clearToken = setTimeout(() => {
      dispatch(authActions.logout());
    }, calculateRemainingTime(authReducer.expiresIn));

    return () => {
      clearTimeout(clearToken);
    };
  }, [authReducer.expiresIn]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {!authReducer.isLoggedIn && (
          <Route path="/auth" element={<AuthPage />} />
        )}

        {authReducer.isLoggedIn && (
          <Route path="/profile" element={<UserProfile />} />
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
