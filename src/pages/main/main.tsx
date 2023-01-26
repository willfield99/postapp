import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { Post } from "./post";
//get docs from a specific firestore colelction so we can show them on the page

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

export const Main = () => {
  const [postsList, setPostsList] = useState<Post[] | null>(null); //no posts till we pull from firebase
  /*
 ts-

 <Post[] | null>

 allow type array of posts or null to be passed to this useState
 */

  const postsRef = collection(db, "posts"); /*
    no need to use react query becuase firebase
     provides us functions for data fetching
     
     here we create a reference of our collection of posts
     */

  const getPosts = async () => {
    //get posts from db asynchronously
    const data = await getDocs(postsRef); //get each entry from the collection reference
    //console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})));//showing data in console in a digestible format
    setPostsList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
    ); //setting our useState
    //mus typecast this data as a post array. often need to do so in typescript
  };

  useEffect(() => {
    getPosts();
  }, []);

  /*empty array makes it so useEffect is only
  called once when we mount the component. if we don't add it will
  also be called when updating
  */
  return (
    /*
  below- mapping thru post list if it exists (?) . for each
  create a post component with current post, ensuring type safety with
  post={post}.
  */
    <div>
      {" "}
      {postsList?.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
};
