import './App.css';
import Header from './Header';
import Post from './Post';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './Layout';
import {Route,Routes} from 'react-router-dom';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';
import ProfilePage from './pages/ProfilePage';
//The <main> tag specifies the main content of a document. The content inside the <main> element should be unique to the document. It should not contain any content that is repeated across documents such as sidebars, navigation links, copyright information, site logos, and search forms.
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />}/>
          <Route path={'/login'} element ={<LoginPage />} />
          <Route path={'/register'} element ={<RegisterPage />} />
          <Route path={'/create-post'} element ={<CreatePost />} />
          <Route path={'/post/:id'} element ={<PostPage />} />
          <Route path={'/edit-post/:id'} element ={<EditPost />} />
          <Route path={'/my-profile'} element ={<ProfilePage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
