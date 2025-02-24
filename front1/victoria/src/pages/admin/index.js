import { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import HomeDashboard from "@/components/admin/home";
import UserManagement from "@/components/admin/users";
import CustomNavbar from "@/components/Navbar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div>
    <CustomNavbar />
    <Container fluid>
      <Row>
        {/* 左侧导航栏 */}
        <Col md={2} className="bg-dark text-white vh-100 p-3">
          <h4 className="text-center">管理系统</h4>
          <Nav className="flex-column mt-4">
            <Nav.Link className="text-white" active={activeTab === "users"} onClick={() => setActiveTab("users")}>用户管理</Nav.Link>
            <Nav.Link className="text-white" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>课程管理</Nav.Link>
            <Nav.Link className="text-white" active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>设置</Nav.Link>
          </Nav>
        </Col>

        {/* 右侧主要内容区域 */}
        <Col md={10} className="p-4">
          {activeTab === "home" && <HomeDashboard />}
          {activeTab === "users" && <UserManagement/>}
          {activeTab === "analytics" && <h3>📊 数据分析</h3>}
          {activeTab === "settings" && <h3>⚙ 系统设置</h3>}
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Dashboard;
