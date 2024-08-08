import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"

const EditPost = ({
    posts, handleEdit, editBody, setEditBody, editTitle,setEditTitle 
}) => {
    const { id } = useParams();
    const post = posts.find(post => (post.id).toString() === id);
    const [newEditTitle, setNewEditTitle] = useState("")
    const [newEditBody, setNewEditBody] = useState("")

    useEffect(() => {
        if (post) {
            setNewEditTitle(post.title);
            setNewEditBody(post.body);
        }
    }, [post])

    return (
        <main className="NewPost">
            {newEditTitle &&
                <>
                    <h2>Edit Post</h2>
                    <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="postTitle">Title:</label>
                        <input
                            id="postTitle" 
                            type="text"
                            required
                            value={editTitle ? editTitle : newEditTitle}
                            onChange={(e) => {
                                setEditTitle(e.target.value) 
                                console.log(editTitle)
                            }} 
                        />
                        <label htmlFor="postBody">Post:</label>
                        <textarea 
                            id="postBody"
                            required
                            value={editBody ? editBody : newEditBody}
                            onChange={(e) => setEditBody(e.target.value)}
                        />
                        <button type="submit" onClick={() => handleEdit(post.id,editTitle ? editTitle : newEditTitle, editBody ? editBody : newEditBody )}>Submit</button>
                    </form>
                </>
            }
            {!newEditTitle &&
                <>
                    <h2>Post Not Found</h2>
                    <p>Well, that's Disappointing.</p>
                    <p>
                        <Link to='/'>Visit To HomePage</Link>
                    </p>
                </>

            }
        </main>
    )
}

export default EditPost