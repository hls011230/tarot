import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Card, Container } from "react-bootstrap";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // 这里替换成你的身份验证逻辑
    if (username === "admin" && password === "123456") {
      router.push("/admin/dashboard"); // 登录成功后跳转
    } else {
      alert("用户名或密码错误");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg p-4 rounded" style={{ width: "400px" }}>
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold text-primary">管理员登录</h3>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username">
              <Form.Label>用户名</Form.Label>
              <Form.Control
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-pill shadow-sm border"
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>密码</Form.Label>
              <Form.Control
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-pill shadow-sm border"
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 mt-4 rounded-pill fw-bold btn-primary">
              登录
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
