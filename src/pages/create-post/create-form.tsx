import { useForm } from "react-hook-form"; //what we use to make the form
import * as yup from "yup"; //form validation
import { yupResolver } from "@hookform/resolvers/yup"; //resolves yup with react hook form
import { addDoc, collection } from "firebase/firestore";
/*addDoc adds a document (an entry) to the db
collection allows us to specify which collection ot add the document to */
import { auth, db } from "../../config/firebase"; //importing our auth and db variables from the firebase config
// ../../ step out of the current folder twice
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface CreateFormData {
  title: string;
  description: string;
}

export const CreateForm = () => {
  const [user] = useAuthState(auth); //used in onCreatePost
  const navigate = useNavigate();//navigate back to homepage

  const schema = yup.object().shape({
    //validates that the input is consistent with our schema
    title: yup.string().min(1).required("You must add a title"),
    description: yup.string().required("You must add a description"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    //resolves our yup validation with our form hook
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "posts");
  const onCreatePost = async (data: CreateFormData) => {
    //this function will execute once a post is submitted
    //handlesubmit passes us the data from the form which can now be used

    await addDoc(postsRef, {
      /*title: data.title,
      description: data.description*/
      ...data, //this is the same as above by structuring the object with the spread operator
      username: user?.displayName, //user name from firestore auth
      userId: user?.uid, //user id
    });
    navigate("/");//sending us back to homepage after creating a post
  };
  return (
    <form onSubmit={handleSubmit(onCreatePost)}>
      <input placeholder="Title..." {...register("title")} />
      {/*registering our inputs with the yup validator. we specifiy the name of the
       field that this input corresponds to so that it can be 
       recorded and validated */}
      <p style={{ color: "red" }}> {errors.title?.message} </p>
      <textarea placeholder="Description..." {...register("description")} />
      <p style={{ color: "red" }}> {errors.description?.message} </p>
      <input type="submit" className="submitForm"/>
    </form>
  );
};
