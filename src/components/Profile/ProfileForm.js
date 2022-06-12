import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import classes from "./ProfileForm.module.css";
import { authActions } from "../../store/authSlice";

const ProfileForm = () => {
  const newPassRef = useRef();

  const dispatch = useDispatch();
  const authReducer = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredNewPassword = newPassRef.current.value;

    // validate new password

    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authReducer.token,
          password: enteredNewPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = data.error.message ?? "Change password Failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        dispatch(authActions.setAuthState(data));
      })
      .catch((error) => {
        alert(error.message);
      });

    newPassRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPassRef} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
