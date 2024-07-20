import React, { useState } from "react";
import "../styles.css" 
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

const Auth = () => {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  console.log("ABHI")
  const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div style = {styles.appStyle} className="App">
      <h2>Sign in/up Form</h2>
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={() => handleOnClick("signIn")}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start the journey with us</p>
              <button className="ghost" id="signUp" onClick={() => handleOnClick("signUp")}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
    appStyle:{
        background: '#f6f5f7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontFamily: 'Montserrat, sans-serif',
        height: '100vh',
        margin: '-20px 0 50px'
    }
}

export default Auth;