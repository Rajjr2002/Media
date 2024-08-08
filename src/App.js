import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Header from "./Header";
import Home from "./Home";
import Missing from "./Missing";
import Footer from "./Footer";
import About from "./About";
import Nav from "./Nav";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { format } from "date-fns";
import api from "./api/post"
import EditPost from "./EditPost";

function App() {
  const [posts, setPosts]= useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('posts');
        setPosts(response.data);
        console.log(posts)
      } catch (err) {
        if (err.response) {
          // Not in the 200 response range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }
    fetchPosts();
  
  })

  

  useEffect(() => {
    const filteredResults = posts.filter((post) => 
    ((post.body).toLowerCase()).includes(search.toLowerCase()) || 
    ((post.title).toLowerCase()).includes(search.toLowerCase()))

    setSearchResults(filteredResults.reverse());},
    [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy, pp');
    const newPost = {id, title: postTitle, datetime, body:postBody };
    try{
      const response = await api.post('/posts', newPost)
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/')
    } catch (err) {
      if (err.response) {
        // Not in the 200 response range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);
      }
    }
  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = {id, title: editTitle, datetime, body: editBody};
    try{
      const response = await api.put(`/posts/${id}`, updatedPost)
      setPosts(posts.map(post => post.id===id ? {...response.data}: post));
      setEditTitle('');
      setEditBody('');
      navigate('/')
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  const handleDelete = async (id) => {
    try{
    await api.delete(`/posts/${id}`)
    const postsList = posts.filter(post => post.id !== id);
    setPosts(postsList)
    navigate("/")
    } catch (err) {
      if (err.response) {
        // Not in the 200 response range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);
      }
    }
  }

  return (
    <div className="App">
      <Header title="Dhuddu Social Media"/>
      <Nav 
        search = {search}
        setSearch={setSearch}
      />
      <Routes>
        <Route path="/" element= {<Home posts={searchResults}/>} />
        <Route path="post">
          <Route index element={<NewPost 
          handleSubmit={handleSubmit}
          postTitle={postTitle}
          setPostTitle={setPostTitle}
          postBody={postBody}
          setPostBody={setPostBody}  
        />} />
        <Route path=":id" element = {<PostPage posts={posts}
        handleDelete={handleDelete}/>} />
        </Route>
        <Route path="/edit/:id" element={<EditPost 
          posts={posts}
          handleEdit={handleEdit}
          editBody={editBody}
          setEditBody={setEditBody}
          editTitle={editTitle}
          setEditTitle={setEditTitle}/>} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
