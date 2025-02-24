import React, { useState, useEffect, use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Card, Nav } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';
import { XCircle } from "react-bootstrap-icons";
import Footer from '@/components/Footer';
import CommitQuestion from '@/components/faq/question';
const AskPage = () => {

    // const [image, setImage] = useState(null);

    // const handleImageChange = (event) => {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onload = () => setImage(reader.result);
    //     reader.readAsDataURL(file);
    //   }
    // };
  
    // const removeImage = () => setImage(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('无牌阵');
    const [about,setAbout] = useState('');

  return (
    <div>
      <CustomNavbar />
      <div className="d-flex justify-content-center align-items-center vh-80 mt-5">
        <div className="card shadow-lg border-0 p-4 rounded-3" style={{ maxWidth: "600px", width: "100%" }}>
             {/* 激励语放在左上角 */}
            <p className="small text-muted fw-bold mb-4">每一次的进步都从提问开始</p>

            {/* 问题标题 */}
            <div className="mb-3">
                <label className="form-label fw-bold">简述背景</label>
                <input type="text" className="form-control" placeholder="请简述背景" value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>

            {/* 选择牌阵类型 */}
            <div className="mb-3">
            <label className="form-label fw-bold">选择牌阵类型</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>

                <option value="无牌阵" >无牌阵</option>
                <option value="二选一" >二选一</option>
                <option value="恋人金字塔"> 恋人金字塔</option>
                <option value="四季牌阵" >四季牌阵</option>
            </select>

            </div>

        {/* 图片上传 */}
        {/* <div className="mb-3">
          <label className="form-label fw-bold">上传牌图</label>
          <div className="image-upload-wrapper border rounded-3 p-3 text-center position-relative" 
               style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}>
            
            {image ? (
              <div className="position-relative">
                <img src={image} alt="Uploaded" className="img-fluid rounded" style={{ maxHeight: "200px" }} />
                <button className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" 
                        onClick={removeImage}>
                  <XCircle size={20} />
                </button>
              </div>
            ) : (
              <div>
                <p className="text-muted">点击或拖拽图片到此处上传</p>
                <input type="file" accept="image/*" className="d-none" id="imageUpload" onChange={handleImageChange} />
                <label htmlFor="imageUpload" className="btn btn-outline-primary">选择图片</label>
              </div>
            )}
          </div>
        </div> */}

            {/* 牌阵描述 */}
            <div className="mb-3">
                <label className="form-label fw-bold">牌阵描述（顺序）</label>
                <input type="text" className="form-control" placeholder="请描述牌阵" value={about} onChange={(e) => setAbout(e.target.value)}/>
            </div>


            {/* 具体内容 */}
            <div className="mb-3">
            <label className="form-label fw-bold">具体问题</label>
            <textarea className="form-control" rows="4" placeholder="请描述你的问题" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            </div>

            {/* 提交按钮 */}
            <div className="text-center">
              <CommitQuestion  question={ {title : title, content : content , about : about , type : type} }/>
            </div>
        </div>
    </div>
    </div>
  );
};

export default AskPage;