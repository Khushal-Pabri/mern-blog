import Editor from '../Editor';
import {useState} from 'react';
import {Navigate} from 'react-router-dom'

export default function CreatePost()
{
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createPost(e)
    {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);

        e.preventDefault();

        console.log(files);

        const response = await fetch("https://mern-blog-backend-8x0q.onrender.com/send-post", {
            method: 'POST',
            body: data,
            credentials: 'include'//sending cookie so that we can get the username
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
        return <Navigate to={'/'} />
    }

    return(
        <form onSubmit={createPost}>
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

            <button style={{marginTop:'10px'}}>Post</button>
        </form>
    );
}