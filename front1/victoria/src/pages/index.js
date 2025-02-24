import Footer from '@/components/Footer';
import CustomNavbar from '../components/Navbar';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import {  useRouter } from 'next/router';

const Home = () => {

  const router = useRouter();

  const stats = [
    { title: '学员', value: '150+' },
    { title: '服务量', value: '1000+' },
    { title: '粉丝量', value: '1000+' },
    { title: '擅长', value: '0 -> 1' },
  ];


  return (
    <div>
      <CustomNavbar />
      <div>
        <section
            className="text-white text-center py-5"
            style={{
              backgroundImage: "url('/static/background.png')", // 替换为你的图片路径
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              position: "relative",
              height: "70vh", // 设置背景图片占据大部分屏幕高度
            }}
        >
          <div
            className="overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)", // 半透明遮罩层
            }}
          />
          <Container position="relative" className="position-relative z-index-1">
            <h1>欢迎来到二梨塔罗学院</h1>
            <p>探索塔罗的奥秘，开启您的心灵之旅。</p>
          </Container>
        </section>
        
        <div className="d-flex flex-column flex-md-row p-0">
        {stats.map((stat, index) => (
            <Col
              key={index}
              className="d-flex flex-column justify-content-center align-items-center p-4 border"
              style={{ flex: 1 }}
            >
              <div className="text-xl font-medium">{stat.title}</div>
              <div className="display-4 font-weight-bold">{stat.value}</div>
            </Col>
          ))}
        </div>

        <Container className="d-flex flex-column flex-md-row p-0">

        </Container>

        <section className="py-5">
          <Container>
            <h2 className="text-center mb-4">我们的课程</h2>
            <Row className=''>
              {/* 示例课程卡片 */}
              <Col md={4} className="mb-4">
                <Card className="course-card h-100">
                  <Card.Img variant="top" src="/static/course.png" className="course-card-img" />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-center">塔罗入门</Card.Title>
                    <Card.Text className="text-muted text-justify flex-grow-1">
                      了解塔罗的基础知识，适合初学者的入门课程。
                    </Card.Text>
                    <Button variant="primary" className="custom-btn" onClick={() => {router.replace('/course')}}>查看详情</Button>
                  </Card.Body>
                </Card>
              </Col>

            </Row>
          </Container>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default Home;