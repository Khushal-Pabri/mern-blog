import { useEffect, useState, useContext } from "react";
import Post from "../Post";
import { UserContext } from "../UserContext";
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';

export default function ProfilePage() {
    const {userInfo} = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);

    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5; 

    console.log(userInfo.username)
    console.log(userInfo._id)

    async function fetchUserPosts() {
        console.log("fetching profile posts")
        const userId = userInfo._id;
        const postsResponse = await fetch(`http://localhost:4400/get-posts?page=${currentPage}&limit=${limit}&userId=${userId}`);
        const postsData = await postsResponse.json();
        setPosts(postsData.posts);
        setTotalPosts(postsData.total);
        setPageCount(postsData.pages);
    }

    useEffect(() => {
        if (userInfo && userInfo._id) {
            fetchUserPosts();
        }
    }, [userInfo, currentPage]);

    // useEffect(() =>{
    //     if (userInfo&& userInfo._id) {
    //         fetchUserPosts();
    //     }
    // })

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);//changing to 1 based page index
        window.scrollTo(0, 0);
    };

    return (
        <div className="profile-page">
            <div className="profile-info">
                <h1>{userInfo.username}</h1>
                <p>Total Posts: {totalPosts}</p>
                {userInfo.createdAt && (
                    <p>Member Since: <time>{format(new Date(userInfo.createdAt), 'MMM d, yyyy HH:mm')}</time></p>
                )}
            </div>

            <div className="user-posts">
                <h2>Your Posts</h2>
                {posts.map(post => (
                    <Post 
                        key={post._id}
                        title={post.title}
                        summary={post.summary}
                        content={post.content}
                        cover={post.cover}
                        updatedAt={post.updatedAt}
                        author={post.author}
                        id={post._id}
                    />
                ))}
            </div>

            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                forcePage={currentPage - 1}
            />
        </div>
    );
}
