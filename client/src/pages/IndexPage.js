import { useEffect, useState, useContext } from "react";
import Post from "../Post";
import ReactPaginate from 'react-paginate';
import { UserContext } from "../UserContext";
export default function IndexPage()
{
    const apiUrl = process.env.REACT_APP_API_URL;

    const [posts, setPosts] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);
    const { category, setCategory, currentPage, setPage } = useContext(UserContext);
    const limit = 5; 

    const fetchPosts = async (page) =>
    {
        const response = await fetch(`${apiUrl}/get-posts?page=${page}&limit=${limit}&category=${category}`);

        const data = await response.json();
        setPosts(data.posts);
        setPageCount(data.pages);
        console.log(data.pages);
    }
    useEffect(() => {
        fetchPosts(currentPage);
    },[currentPage, category])

    const handlePageClick = (data) => {
        setPage(data.selected + 1);
        window.scrollTo(0, 0);
    };

    const handleCategoryChange = (category) => {
        setCategory(category);
        setPage(1);
    };

    //&& operator in JSX.
    return(
        <>
        <div className="category-buttons">
            {['', 'Technology', 'Science', 'Health', 'Business', 'Entertainment', 'Sports'].map((cat, i) => (
                <button 
                    key={i} 
                    onClick={() => handleCategoryChange(cat)}
                    className={category === cat ? 'active' : ''}
                >
                    {cat || 'All'}
                </button>
            ))}
        </div>
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
        <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed = {2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                forcePage={currentPage - 1}
                renderOnZeroPageCount={null}
        />
        </>
    );
}