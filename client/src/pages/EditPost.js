import { useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import {Navigate} from 'react-router-dom'
import Editor from '../Editor';

export default function EditPost()
{
    const apiUrl = process.env.REACT_APP_API_URL;
    
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [category, setCategory] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
        fetch(`${apiUrl}/post/${id}`, {
            method: 'GET'
        }).then(response => {
            response.json().then(postInfo =>{
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
                setFiles(postInfo.file);
                setCategory(postInfo.category);
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
        data.set('category', category);
        if(files?.[0])
        {
            data.set('file', files?.[0]);//?. is the optional chaining operator, which means if files is null or undefined, the expression will short-circuit, and the result will be undefined.
        }

        e.preventDefault();

        const response = await fetch(`${apiUrl}/edit-post/${id}`, {
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

        <div className="select-container">
            <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="custom-select"
            >
                <option value="" disabled selected>Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Business">Business</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Sports">Sports</option>
                <option value="Science">Science</option>
                <option value="Other">Other</option>
            </select>
        </div>

            <Editor onChange={setContent} value = {content} />

            <button style={{marginTop:'10px'}}>Update Post</button>
        </form>
    );
}