import { format} from 'date-fns';
import { Link } from "react-router-dom";
export default function Post(props)
{
    return(
        <main>
            <div className="post">
                <div className = "image">
                <Link to={`/post/${props.id}`}><img src={props.cover}></img></Link>
                </div>
                <div className="texts">
                    <Link to={`/post/${props.id}`}><h2>{props.title}</h2></Link>
                    <p className="info">
                        <span className="author">{props.author.username}</span>
                        <time>{format(new Date(props.updatedAt), 'MMM d, yyyy HH:mm')}</time>
                    </p>
                    <p className="summary">{props.summary}</p>
                </div>
            </div>
        </main>
    );
}