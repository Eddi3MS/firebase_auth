import ProfileForm from "./ProfileForm";
import { useSelector } from "react-redux";
import classes from "./UserProfile.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const authReducer = useSelector((state) => state.auth);

  let navigate = useNavigate();

  useEffect(() => {
    if (!authReducer.isLoggedIn) {
      navigate("/auth", { replace: true });
    }
  }, [authReducer.isLoggedIn]);
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
};

export default UserProfile;
