import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, InputGroup, Container, Pagination } from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/router";

const UserManagement = () => {

  const router = useRouter();
  // 用户数据
  const [users, setUsers] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userInfoModal, setUserInfoModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "123456" });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const getUsers = async () => {
    try {
      // 这里可以调用 API 获取用户数据
      const {data} = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/get-users');
      console.log(data);
      
      setUsers(data.data);
 

    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    // 这里可以调用 API 获取用户数据
    getUsers();
  }, []);

  // 搜索用户
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 计算分页
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const addUser = async () => {
    const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, newUser);
    if (data.code === 0) {
      alert("添加失败");
      return;
    } else {
      router.reload();
    }
  };

  // 处理添加/编辑用户
  const handleSaveUser = () => {
    if (editUser) {
      console.log("update");
      
    } else {
      addUser();

    }
    setShowModal(false);
    setEditUser(null);
    setNewUser({ username: "", email: "",password: "123456" });
  };

  // 处理删除用户
  const handleDeleteUser = (id) => {
    const confirmed = window.confirm("确定要删除该用户吗？");
    if (confirmed) {
      const delete_user = async () => {
        await axios.post(process.env.NEXT_PUBLIC_API_URL + '/delete-user', {"id": id});
        if (data.code === 0) {
          alert("删除失败");
          return;
        } else {
          router.reload();
        }
      }
      delete_user();
  }};

  return (
    <Container>
      <h2 className="mb-4">👤 用户管理</h2>

     <div className="d-flex justify-content-between align-items-center">
        {/* 搜索栏 */}
        <InputGroup className="mb-3 w-50">
            <Form.Control
            placeholder="请输入用户名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="primary">🔍 搜索</Button>
        </InputGroup>
        
        {/* 新增用户按钮 */}
        <Button className="mt-3" variant="success" onClick={() => { setEditUser(null); setShowModal(true); }}>➕ 新增用户</Button>
     </div>

      {/* 用户表格 */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>用户名</th>
            <th>邮箱</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.status === 'active' ? "激活" : "禁止"}</td>
              <td>
                <Button variant="success" size="sm" onClick={() => { setUserInfo(user.user_info); setUserInfoModal(true); }}>查看</Button>{" "}
                <Button variant="warning" size="sm" onClick={() => { setEditUser(user); setShowModal(true); }}>编辑</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>删除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 分页 */}
      <Pagination className="justify-content-center">
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* 用户编辑/新增 模态框 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? "编辑用户" : "新增用户"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>用户名</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={editUser ? editUser.username : newUser.username}
                onChange={(e) => editUser ? setEditUser({ ...editUser, username: e.target.value }) : setNewUser({ ...newUser, username: e.target.value })}
                />

            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>邮箱</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editUser ? editUser.email : newUser.email}
                onChange={(e) => editUser ? setEditUser({ ...editUser, email: e.target.value }) : setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>取消</Button>
          <Button variant="primary" onClick={handleSaveUser}>确定</Button>
        </Modal.Footer>
      </Modal>

      {/* 用户信息 模态框 */}
      <Modal show={userInfoModal} onHide={() => setUserInfoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>用户信息</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>姓名</Form.Label>
              <Form.Control type="text"  value={userInfo?.name || "未绑定"} disabled></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>电话</Form.Label>
              <Form.Control type="text" value={userInfo?.phone || "未绑定"} disabled></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>地址</Form.Label>
              <Form.Control type="text" value={userInfo?.address || "未绑定"} disabled></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserManagement;
