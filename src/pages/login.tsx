import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate(); //navigate below redirects use to the home page after signing in

  const signInWithGoogle = async () => {
    //signing in with google. must be async await because were wating for a response
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/");
  };
  return (
    <div>
      {" "}
      <p>Sign in with Google to Continue</p>{" "}
      <button onClick={signInWithGoogle}> Sign in with Google</button>
    </div>
  );
};
