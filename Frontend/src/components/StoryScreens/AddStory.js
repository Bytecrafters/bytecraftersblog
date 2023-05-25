import React, { useRef, useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from "react-icons/ai";
import { FiArrowLeft } from "react-icons/fi";
import "../../Css/AddStory.css";
import CodeEditor from "./CodeEditor";

const AddStory = () => {
 

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };
 

  const { config } = useContext(AuthContext);
  const imageEl = useRef(null);
  const editorEl = useRef(null);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");//!code editor

  const drivelink='http://drive.google.com/uc?export=view&id=';

  //! after submit clear all input
  const clearInputs = () => {
    setTitle("");
    setContent("");
    setImage("");
    setCode("");
    editorEl.current.editor.setData("");
    imageEl.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(); // Created new 'formdata' object
    formdata.append("title", title);
    formdata.append("image", image);
    formdata.append("content", content);
    formdata.append("code", code);//!


    try {
      const { data } = await axios.post("/story/addstory", formdata, config);
      setSuccess("Add story successfully ");

      clearInputs();
      setTimeout(() => {
        setSuccess("");
      }, 7000);
    } catch (error) {
      setTimeout(() => {
        setError("");
      }, 7000);
      setError(error.response.data.error);
    }
  };
  return (
    <div className="Inclusive-addStory-page ">
      <Link to={"/"}>
        <FiArrowLeft />
      </Link>
      <form onSubmit={handleSubmit} className="addStory-form">
        {error && <div className="error_msg">{error}</div>}
        {success && (
          <div className="success_msg">
            <span>{success}</span>
            <Link to="/">Go home</Link>
          </div>
        )}

        <input
          type="text"
          required
          id="title"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <CKEditor
          editor={ClassicEditor}
          onChange={(e, editor) => {
            const data = editor.getData(); //! input in ckeditor will save in data variable
            setContent(data); //! then we append setContent value to data
          }}
          ref={editorEl}
        />


        <div>
          <div>
            <h1>Blog Editor</h1>
            <CodeEditor code={code} onChange={handleCodeChange}  />
            {/* Other form elements for heading, text, upload date, etc. */}
          </div>
        </div>


        <div class="StoryImageField">
          <AiOutlineUpload />
          <div class="txt">
            {image
              ? image.name
              : " Include a high-quality image in your story to make it more inviting to readers."}
          </div>
          <input
            name="image"
            type="file"
          
            ref={imageEl}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        
        </div>


        


        <button
          type="submit"
          disabled={image ? false : true}
          className={image ? "addStory-btn" : "dis-btn"}
        >
          Publish{" "}
        </button>
      </form>
    </div>
  );
};

export default AddStory;




