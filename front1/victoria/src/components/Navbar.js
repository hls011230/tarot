import { Navbar, Nav, NavDropdown, Button, Container , Modal ,Form } from 'react-bootstrap';
import CustomLink from './CustomLink';
import { use, useContext, useEffect, useState  } from 'react';
import Login from './Login';
import { getLocalStorageToken, removeLocalStorageToken, TokenContext } from './Token';
import { useRouter } from 'next/router';

const CustomNavbar = () => {

  const router = useRouter();

  const [show, setShow] = useState(false);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [userShow, setUserShow] = useState(false);
  const [loginShow,setLoginShow] = useState(true);
  const token = getLocalStorageToken('id');
  const {user,logout} = useContext(TokenContext);
  const {login} = router.query;

  const handleShow = () => setShow(!show);

  useEffect(() => {
    if (token !== undefined) {
      setLoginShow(false);
      setUserShow(true);
    }

    if (login !== undefined){

      if (login === 'false'){
        alert('请先登录!!');
        setShow(true);
      }else {
        setUsername('');
        setPassword('');
        setShow(false);
      }
    }

  }, [token,router]);



  return (
    
    <Navbar expand="lg" className="navbar-dark shadow-sm">
    <Container>
        {/* Logo */}
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src="/static/logo.png"
            width="100"
            height="60"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>

        {/* 响应式折叠按钮 */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 p-3">
            <span className="fs-3 fw-bold text-primary">☰</span>
        </Navbar.Toggle>

        {/* 导航项 */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-3">
            <CustomLink href="/" className="nav-link text-dark fw-bolder">首页</CustomLink>
            <CustomLink href="/faq" className="nav-link text-dark fw-bolder">问答</CustomLink>
            <CustomLink href="/courses" className="nav-link text-dark fw-bolder">资料</CustomLink>
            { user?.role === 'assistant' && <CustomLink href="/admin" className="nav-link text-dark fw-bolder">管理</CustomLink> }
          </Nav>

          {/* 登录按钮 */}
          { userShow &&
              <div className="d-flex align-items-center">
              {/* 头像 + 用户名 */}
              <Navbar.Text className="d-flex align-items-center me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-person-circle text-primary me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
                <span className="fw-bold text-dark">{user?.username}</span>
              </Navbar.Text>
        
              {/* 下拉菜单 */}
              <NavDropdown id="user-dropdown" align="end">

                <NavDropdown.Item
                  href="#"
                  className=" fw-bold"
                  onClick={() => {
                    router.replace("/userInfo");
                  }}
                > 个人信息
                </NavDropdown.Item>
              
                <NavDropdown.Item
                  href="#"
                  className=" fw-bold"
                  onClick={() => {
                    logout();
                    setLoginShow(true);
                    setUserShow(false);
                    router.replace("/");
                  }}
                > 退出
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          }

          { loginShow &&
                      <Button onClick={handleShow} className="px-3 rounded-pill"  >
                      登录
                    </Button>
          }
        </Navbar.Collapse>
      </Container>

      {/* 登录模态框 */}
      <>
        <Modal show={show} onHide={handleShow} centered>
          <Modal.Header closeButton>
            <Modal.Title>登录</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="custom-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="custom-input"
                />
              </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Login variant="primary" className="custom-btn"  user = {{username:username,password:password}}/>
          </Modal.Footer>
        </Modal>
      </>

    </Navbar>



  );
};

export default CustomNavbar;