import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/authSlice";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  let emailRef = useRef(null);
  let passwordRef = useRef(null);

  const dispatch = useDispatch();
  const authReducer = useSelector((state) => state.auth);

  let navigate = useNavigate();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  useEffect(() => {
    if (authReducer.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [authReducer.isLoggedIn]);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    //validate data

    setIsLoading(true);
//     let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`;
    let url = `${process.env.SIGNUP}/${process.env.REACT_APP_FIREBASE_KEY}`

    if (isLogin) {
//       url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`;
      
      let url = `${process.env.SIGNIN}/${process.env.REACT_APP_FIREBASE_KEY}`
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);

        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = data.error.message ?? "Authetication Failed!";

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        if (isLogin) {
          dispatch(authActions.setAuthState(data));
        }
      })
      .catch((error) => {
        alert(error.message);
      });

    emailRef.current.value = "";
    passwordRef.current.value = "";
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input ref={passwordRef} type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          {!isLoading ? (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          ) : (
            <p style={{ color: "#fff" }}>Sending request...</p>
          )}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
