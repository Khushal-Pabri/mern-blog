import { useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import {Navigate} from 'react-router-dom'
import Editor from '../Editor';

export default function EditPost()
{
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
        fetch('https://mern-blog-backend-8x0q.onrender.com/post/'+id, {
            method: 'GET'
        }).then(response => {
            response.json().then(postInfo =>{
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
                setFiles(postInfo.file);
                console.log(postInfo);
            })
        })
    },[])

    async function updatePost(e)
    {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('postid', id);
        if(files?.[0])
        {
            data.set('file', files?.[0]);//?. is the optional chaining operator, which means if files is null or undefined, the expression will short-circuit, and the result will be undefined.
        }

        e.preventDefault();

        const response = await fetch(`https://mern-blog-backend-8x0q.onrender.com/edit-post/${id}`, {
            method: 'PUT',
            body: data,
            credentials:'include'
        });
        console.log(await response.json());

        if(response.ok)
        {
            console.log('post created');
            setRedirect(true);
        }
    }

    if(redirect)
    {
        return <Navigate to={`/post/${id}`} />
    }
    return(
        <form onSubmit={updatePost}>
            <input type = 'title' 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}/>

            <input type = 'summary' 
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}/>

            <input type = 'file'
            onChange={(e) => setFiles(e.target.files)}/>

            <Editor onChange={setContent} value = {content} />

            <button style={{marginTop:'10px'}}>Update Post</button>
        </form>
    );
}