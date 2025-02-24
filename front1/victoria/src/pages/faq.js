import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Card, Nav, Pagination} from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';
import QuestionList from '../components/QuestionList'; // 假设问题列表组件路径
import CommunityContent from '../components/CommunityContent'; // 假设社区内容组件路径
import Footer from '../components/Footer';
import withAuth from '@/components/withAuth';

const FaqPage = () => {
  const [activeTab, setActiveTab] = useState('#all');

  useEffect(() => {
    
  }, [activeTab]);

  return (
    <div>
      <CustomNavbar />
      <div className="container mt-4 mb-5">
        <div className="row">
          <div className="col-md-8">
            <Card>
              <Card.Header>
                <Nav variant="tabs" defaultActiveKey="#all" activeKey={activeTab} onSelect={(eventKey) => setActiveTab(eventKey)}>
                  <Nav.Item>
                    <Nav.Link href="#all">全部</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#finished">已回答</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#pending">待回答</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <QuestionList status={activeTab} />

              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3">
            <CommunityContent />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default withAuth(FaqPage);