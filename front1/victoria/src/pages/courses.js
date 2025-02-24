import CustomNavbar from '../components/Navbar';
import { Container, Row, Col, Card, Button ,Nav} from 'react-bootstrap';
import { useState } from 'react';
import './course.css'
import withAuth from '@/components/withAuth';
const Courses = () => {

  const documents = [
    { title: '塔罗服务术语', url: 'http://kdocs.cn/l/cmCg1kf1NArE' },
    { title: '塔罗课程案例', url: 'http://kdocs.cn/l/cvvlP4aNzM0T' },
    { title: '干货合集', url: 'http://kdocs.cn/l/chsJLX0DsTNc' },
  ];

  const [selectedDoc, setSelectedDoc] = useState(documents[0].url);

  return (
    <div>
      <CustomNavbar />
      <Container fluid>
      <Row>
        {/* 左侧导航栏 */}
        <Col md={2} className="bg-light border-right vh-100">
          <Nav className="flex-column p-3">
            {documents.map((doc, index) => (
              <Nav.Link
                key={index}
                onClick={() => setSelectedDoc(doc.url)}
                className={selectedDoc === doc.url ? 'active' : ''}
              >
                {doc.title}
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        {/* 右侧内容区域 */}
        <Col md={10} className="p-3">
          <iframe
            src={selectedDoc}
            title="Document Viewer"
            style={{ width: '100%', height: '90vh', border: 'none' }}
          />
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default withAuth(Courses);