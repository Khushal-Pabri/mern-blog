import { useEffect, useState } from "react";
import Post from "../Post";
export default function IndexPage()
{
    const [posts, setPosts] = useState([]);
    async function getAllPosts()
    {
        const response = await fetch("https://mern-blog-backend-8x0q.onrender.com/get-posts", {
            method: 'GET',
        })

        setPosts(await response.json());
        //console.log(posts);
    }
    useEffect(() => {
        getAllPosts();
    },[])

    //&& operator in JSX.
    return(
        <>
        {
            posts.length>0 && posts.map((post,i) =>
            (
                <Post key={i}
                title = {post.title}
                summary = {post.summary}
                content = {post.content}
                cover = {post.cover}
                updatedAt = {post.updatedAt}
                author = {post.author}
                id = {post._id}
                />
            ))
        }
        </>
    );
}