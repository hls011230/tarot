import Footer from "@/components/Footer";
import CustomNavbar from "@/components/Navbar";
import { Card, Button, Row, Col, ListGroup, Image ,Modal ,Form} from "react-bootstrap";
import { TokenContext } from "@/components/Token";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {useRouter} from "next/router";
import { getLocalStorageToken, removeLocalStorageToken } from "@/components/Token";

const UserProfile = () => {

    const router = useRouter();
    const {user, refreshUser} = useContext(TokenContext);
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.user_info?.name || "",
        phone: user?.user_info?.phone || "",
        address: user?.user_info?.address || "",
      });
      // 处理输入变化
    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

        // 处理提交
    const handleSubmit = async () => {
    try {

            const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/update-user-info/${user.id}`, formData);
            if (data.code === 1) {
            alert("用户信息更新成功！");
            setShowModal(false);
            refreshUser();
        }

    } catch (error) {
        console.error("更新失败:", error);
        alert("更新失败，请重试");
    }
    };



    

  return (
    <div>
    <CustomNavbar/>
    <div className="container mt-4">
      <Card className="shadow-lg p-4">
        <Row className="align-items-center">
          {/* 用户头像 */}
          <Col md={3} className="text-center">
            <Image 
              src={user || "/static/default-avatar.png"} 
              roundedCircle 
              width="120" 
              height="120"
              className="border shadow-sm"
            />
            <p className="mt-2 fw-bold">{user.username}</p>
          </Col>

          {/* 用户基本信息 */}
          <Col md={9}>
            <h4 className="fw-bold">用户信息</h4>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>用户名：</strong> {user.username}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>邮箱：</strong> {user.email || "未绑定"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>收件名：</strong> {user.user_info.name || "未绑定"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>手机号：</strong> {user.user_info.phone || "未绑定"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>收件地址: </strong> {user.user_info.address || "未绑定"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>注册时间：</strong> {new Date(user.created_at).toLocaleDateString()}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>账户状态：</strong> 
                <span className={`badge ${user.status === 'active' ? "bg-success" : "bg-danger"} ms-2`}>
                  {user.status === 'active' ? "已激活" : "未激活"}
                </span>
              </ListGroup.Item>
            </ListGroup>

            {/* 操作按钮 */}
            <div className="mt-4 d-flex justify-content-end gap-3">
              <Button variant="primary" onClick={() => setShowModal(true)}>编辑信息</Button>
              <Button variant="outline-secondary" onClick={() => router.push('/')}>返回</Button>
            </div>
          </Col>
        </Row>
      </Card>


            {/* 用户编辑 模态框 */}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>编辑信息</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>用户名</Form.Label>
              <Form.Control
                type="text"
                value={user.username} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>邮箱</Form.Label>
              <Form.Control
                type="email"
                value={user.email}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>收件名</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>手机号</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>收件地址</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>取消</Button>
          <Button variant="primary" onClick={handleSubmit}>确定</Button>
        </Modal.Footer>
    </Modal>
    </div>
    <div className="mt-5">
        <Footer />  
    </div>
    </div>
  );
};

export default UserProfile;
