import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";//React Router’s useParams() hook can be used by a component rendered by a <Route> with a dynamic path to get the names and values of the current URL’s parameters.
import { format} from 'date-fns';
import { UserContext } from "../UserContext";
import {Link} from 'react-router-dom';

export default function PostPage()
{
    const {id} = useParams();
    const [postInfo, setPostInfo] = useState({});
    const {userInfo} = useContext(UserContext);
    async function getPost()
    {
        const response = await fetch(`http://localhost:4400/post/${id}`, {
            method: 'GET'
        })
        let data = await response.json();
        setPostInfo(data);
    }
    useEffect(()=>{
        console.log(id);
        getPost();
    },[])

    if(!postInfo) return '';

    //dangerouslySetInnerHTML, is a prop in React that allows you to set HTML directly from a variable, which is indicated by the use of double curly braces ({{ }}).
    // By using dangerouslySetInnerHTML, you are telling React to insert the raw HTML content into the DOM, potentially exposing your application to Cross-Site Scripting (XSS) attacks if the content is not sanitized properly.
    return(
        <div className="post-page">
            <h1 className="title">{postInfo.title}</h1>
            <div className="info">
                {postInfo.author && (
                    <span>Author: {postInfo.author.username}</span>
                )}
                {postInfo.updatedAt && (
                    <time>Updated At: {format(new Date(postInfo.updatedAt), 'MMM d, yyyy HH:mm')}</time>
                )}
            </div>
            {postInfo && postInfo.author && userInfo && userInfo._id === postInfo.author._id &&(
                <div className="edit-row">
                    {userInfo.name}
                    <Link className="edit-button" to={`/edit-post/${postInfo._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                        Edit
                    </Link>
                </div>
            )}
            {/* <time>{format(new Date(postInfo.updatedAt), 'MMM d, yyyy HH:mm')}</time> */}
            <div className="image">
                <img src={postInfo.cover}></img>
            </div>
            <div dangerouslySetInnerHTML={{__html:postInfo.content}}></div>
        </div>
    );
}