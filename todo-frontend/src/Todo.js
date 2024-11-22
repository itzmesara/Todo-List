import { useEffect, useState } from "react"

export default function Todo()
{
    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const [todos,setTodos]=useState([])
    const [error,setError]=useState("")
    const [editId,setEditId]=useState(-1)
    //Edit
    const [Edittitle,setEditTitle]=useState("")
    const [Editdescription,setEditDescription]=useState("")
    const [message,setMessage]=useState('')
    const apiUrl="http://localhost:8000"

    
    const handleSubmit=()=>{
        //check inputs
        if(title.trim()!==''&&description.trim()!=='')
        {
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok)
                {
                setTodos([...todos,{title,description}])
                setMessage('Item added successfully')
                setTimeout(()=>{

                    setTitle("")
                    setDescription("")
                },2000)
                setTimeout(()=>{
                    setMessage("");
                },3000)
                }
                else{
                    setError("Unable to create Todo items")
                    setTimeout(()=>{
                        setError("")
                    },4000)
                }
            }).catch(()=>{
                setError("Unable to create Todo items")
                setTimeout(()=>{
                    setError("")
                },4000)
            })
        }
    }

    const handleUpdate=()=>{

    }

    useEffect(()=>{
        getItems()
    },[])

    const getItems=()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>res.json())
        .then((res)=>{setTodos(res)})
    }
    return(
        <>
        <div className="row p-3 bg-success text-light">
            <h1>Todo List</h1>
        </div>
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">

            <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="form-control" type="text"/>
            <input placeholder="Description" value={description} onChange={(e)=> setDescription(e.target.value)} className="form-control" type="text"/>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error &&<p className="text-danger">{error}</p>}
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <ul className="list-group">
                
                {todos &&
                    todos.map((item) => <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                    <div className="d-flex flex-column">
                        {
                            editId==-1 ?<>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                            </>:<>
                            <div className="form-group d-flex gap-2">
                            <input placeholder="Title" value={title} onChange={(e)=>setEditTitle(e.target.value)} className="form-control" type="text"/>
            <input placeholder="Description" value={description} onChange={(e)=> setEditDescription(e.target.value)} className="form-control" type="text"/>
                            </div>
                            </>
                        }

                    </div>
                    <div className="d-flex gap-2">

                    
                        {editId !==-1 ? 
                    <button className="btn btn-warning" onClick={()=> setEditId(item._id)}>Edit</button>:<button className="btn btn-warning"onClick={handleUpdate}>Update</button>
                        }
                    <button className="btn btn-danger">Delete</button>
                    
                    </div>
                </li>
                )}
            </ul>
        </div>

        </>
    )
}