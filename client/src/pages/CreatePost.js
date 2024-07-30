import Editor from '../Editor';
import {useState} from 'react';
import {Navigate} from 'react-router-dom'

export default function CreatePost()
{
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [category, setCategory] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createPost(e)
    {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        data.set('category', category);

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

    const isFormValid = title && summary && content && files && category;

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

            <button style={{marginTop:'10px'}}  disabled={!isFormValid} >Post</button>
        </form>
    );
}