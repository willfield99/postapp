import { Link } from "react-router-dom";
import { auth } from "../config/firebase";//take in auth from firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export const Navbar = () => {
  const [user] = useAuthState(auth);
  /*takes in authorization details to get the user state.
   Using this state will allow a different sign in to update 
   the user shown on the site*/

  const signUserOut = async () => {
    await signOut(auth);
  };
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/"> Home</Link>
       {!user ? (<Link to="/login"> Login</Link>) : 
        (<Link to="/createpost"> Create Post</Link>)}
      </div>
      <div className="user">
        {user /* good trick. if user then show username and image. */ && (
          <>
            {" "}
            {/* <- this fragment wraps the code that shows if there is a user*/}
            <p> {auth.currentUser?.displayName}</p>
            <img
              src={auth.currentUser?.photoURL || ""}
              width="20"
              height="20"
            />
            {/*ts doesnt like null sources.
         use or to show empty string in case of no user */}
            <button onClick={signUserOut}>log out</button>
          </>
        )}
      </div>
    </div>
  );
};
