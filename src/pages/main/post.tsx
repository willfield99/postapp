import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore"; // query allows direct pull from collection
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { Post as IPost } from "./main"; //importing as Ipost (interface post)
interface Props {
  post: IPost; //defining the type of our prop for ts
}

interface Like {
  //like interface declares like as a type
  likeId: string;
  userId: string;
}

export const Post = (props: Props) => {
  const { post } = props; //getting post from post list we are mapping in main
  const [user] = useAuthState(auth); //plling user from db

  const [likes, setLikes] = useState<Like[] | null>(null);
  /*likes is an array. the numer of likes is the length,
   each item is the user id of an individual like*/

  const likesRef = collection(db, "likes"); //pulling likes from db

  const likesDoc = query(likesRef, where("postId", "==", post.id));
  //pulling likes from the post

  const getLikes = async () => {
    //get likes from reference to doc. set to the mapped out list of userids that liked this post
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const addLike = async () => {
    //async adding likes to db
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      }); //post passed as a prop from main?
      if (user) {
        //if user exists -- OPTIMISTIC RENDERING
        setLikes(
          (
            prev //set likes to prev + new like
          ) =>
            prev
              ? [...prev, { userId: user.uid, likeId: newDoc.id }]
              : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    //async adding likes to db
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid) //finding the like to remove
      );
      const likeToDeleteData = await getDocs(likeToDeleteQuery); //getting specific like from query
      const likeId = likeToDeleteData.docs[0].id; //id of like that we are deleting
      const likeToDelete = doc(db, "likes", likeId); //doc imported from firestore
      //pulling the id of that like

      await deleteDoc(likeToDelete); //actually deleting the doc
      //await addDoc(likesRef, { userId: user?.uid, postId: post.id }); //post passed as a prop from main?
      if (user) {
        //if user exists -- OPTIMISTIC RENDERING
        setLikes(
          (
            prev //set likes to prev + new like
          ) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);
  //find function. looks thru list checking for value that satisfies a condition

  useEffect(() => {
    //getting our likes
    getLikes();
  }, []);

  return (
    <div>
      <div className="title">
        <h1> {post.title}</h1>
      </div>
      <div className="body">
        <p>{post.description}</p>
      </div>
      <div className="footer">
        <p>@{post.username}</p>
        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}{" "}
        </button>
        {likes && <p> Likes: {likes?.length}</p>}
      </div>
    </div>
  );
};
