import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Card, ListGroup, Form, Button, Container } from 'react-bootstrap';
import Footer from '@/components/Footer';
import CustomNavbar from '@/components/Navbar';
import axios from 'axios';
import { getLocalStorageToken } from '@/components/Token';


const QuestionDetail = () => {
  const router = useRouter();
  const { id } = router.query; // 获取URL中的问题ID
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = getLocalStorageToken('id');
  
  const getComments = async () => {
    const {data} = await axios.get(process.env.NEXT_PUBLIC_API_URL +`/get-comments-by-question/${id}`);
    if (data.code === 0) {
      setComments([]);
      return;
    }    
    setComments(data.data);
    console.log(comments);
    
  }

  const addComment = async () => {
    const {data} = await axios.post(process.env.NEXT_PUBLIC_API_URL +`/submit-comment`, {
        user_id: token,
        question_id: id,
        content: newComment,
        parent_comment_id: 0,
    });
    
    if (data.code === 0) {
      alert("评论失败");
      return;
    }else {
        setNewComment("");
        getComments();
    }
  }

  const handleAdopt = async () => {

    const {data} = await axios.post(process.env.NEXT_PUBLIC_API_URL +`/update-question-status`, {
        question_id: id,
        new_status: "finished",
    });

    if (data.code === 0) {
      alert("采纳失败");
      return;
    }else {
        alert("采纳成功");
        router.reload();
    }
  }
  
  useEffect(() => {
    if (id) {
      const getQuestion = async () => {
        const {data} = await axios.get(process.env.NEXT_PUBLIC_API_URL +`/get-question-by-id/${id}`);
        
        setQuestion(data.data);
      }

      getQuestion();
      getComments();
    }
  }, [id]);

  const handleAddComment = () => {
    addComment()
  };

  if (!question) return <div className="text-center mt-5">加载中...</div>;

  return (
    <div>
    <CustomNavbar />
    <Container className="mt-4">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h4>{question.title}</h4>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>问题 ID：</strong> {question.id}</ListGroup.Item>
            <ListGroup.Item><strong>问题背景：</strong> {question.title}</ListGroup.Item>
            <ListGroup.Item><strong>牌阵类型：</strong> {question.type}</ListGroup.Item>
            <ListGroup.Item><strong>牌阵描述：</strong> {question.about}</ListGroup.Item>
            <ListGroup.Item><strong>问题内容：</strong> {question.content}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* 评论区 */}
      <Card className="mt-4">
      <Card.Header className="bg-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">评论区</h5>
        { question.user_id === Number(token) ? question.status === "pending" ? <Button onClick={handleAdopt} variant="danger" className="fw-bold text-red">采纳</Button> :  <Button disabled variant="success" className="fw-bold text-red">已采纳</Button>   : "" }
      </Card.Header>
        <Card.Body>  
        <ListGroup variant="flush">
          {comments.map((comment, index) => (
            <ListGroup.Item key={index} className="">
              <div className="d-flex align-items-center mb-1">
                  <strong className="me-2">{comment.user.username}</strong>
                  {comment.user.role === "assistant" && (
                <span className="badge bg-primary me-2">小助理</span>
                  )}
              </div>
              
              <p className="text-muted mb-0">{comment.content}</p>
            </ListGroup.Item>
          ))}

        </ListGroup>


          {/* 添加新评论 */}
          <Form className="mt-3">
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="写下你的看法..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
            <Button className="mt-2" variant="primary" onClick={handleAddComment}>
              提交评论
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    <Footer />
    </div>
  );
};

export default QuestionDetail;
