import { useState } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Card, ListGroup, Button, Accordion, Form } from "react-bootstrap";
import Footer from "@/components/Footer";
import CustomLink from "@/components/CustomLink";
import CustomNavbar from "@/components/Navbar";

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query; // 获取课程 ID

  // 课程示例数据（可替换成 API 获取）
  const course = {
    id: id,
    title: "塔罗入门",
    description: "了解塔罗牌的基础知识，适合初学者的入门课程。",
    cover: "/static/course.png",
    syllabus: [
      { title: "第一部分：占星基础", contents: ['课前导言','塔罗占星必备四大元素','12星座与宫廷牌'] },
      { title: "第二部分：塔罗一阶", contents: ['大阿卡纳详解','小阿卡纳详解'] },
      { title: "第三部分：塔罗二阶", contents: [] },
    ],
    reviews: [
      { user: "Alice", comment: "课程很棒！老师讲解清晰易懂。", rating: 5 },
      { user: "Bob", comment: "对塔罗感兴趣的朋友一定要学！", rating: 4 }
    ]
  };

  // 课程评论提交
  const [newComment, setNewComment] = useState("");
  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;
    course.reviews.push({ user: "匿名用户", comment: newComment, rating: 4 });
    setNewComment("");
  };

  return (
    <div>
    <CustomNavbar />
    <Container className="mt-5">
      <Row>


        {/* 课程侧边栏 */}
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">课程信息</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>类别：</strong> 塔罗入门 </ListGroup.Item>
              <ListGroup.Item><strong>难度：</strong> 初级 </ListGroup.Item>
              <ListGroup.Item><strong>讲师：</strong> 二梨老师 </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>


        {/* 课程主要信息 */}
        <Col md={8}>
          <Card className="shadow-lg">
            {/* <Card.Img variant="top" src={course.cover} alt={course.title} /> */}
            <Card.Body>
              <Card.Title className="fw-bold fs-3">{course.title}</Card.Title>
              <Card.Text className="text-muted">{course.description}</Card.Text>
              <Button variant="primary" className="w-100">立即报名</Button>
            </Card.Body>
          </Card>

          {/* 课程大纲 */}
          <Accordion defaultActiveKey="0" className="mt-4">
            {course.syllabus.map((lesson, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{lesson.title}</Accordion.Header>
                <Accordion.Body>
                    <ListGroup variant="flush">
                    {lesson.contents.map((content, i) => (
                        <ListGroup.Item key={i} className="py-2">
                        <strong>{`${index + 1}.${i + 1}`}</strong> {content}
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>


      </Row>
    </Container>
    <div className="mt-5">
        <Footer/>
    </div>
    </div>

  );
}
