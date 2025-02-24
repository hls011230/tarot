import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Pagination } from 'react-bootstrap';

const QuestionList = ({ status }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const questionsPerPage = 5; // 每页显示 5 条数据

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const { data } = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/get-questions');
        setQuestions(data.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    getQuestions();
  }, []);

  useEffect(()  => {
    setCurrentPage(1);
  },[status])

  // 筛选问题
  const filteredQuestions = questions.filter((question) => {
    if (status === '#all') return true;
    return question.status === status.replace('#', '');
  });

  // 计算总页数
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // 计算当前页的问题
  const currentQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  return (
    <div className="question-list">
      {/* 问题列表 */}
      {currentQuestions.map((question) => (
        <div
          key={question.id}
          className={`card mb-3 shadow-sm border-${question.status === 'finished' ? 'success' : 'warning'}`}
          onClick={() => router.push(`/question?id=${question.id}`)}
        >
          <div className="card-header d-flex justify-content-between align-items-center bg-light">
            <span className={`badge ${question.status === 'finished' ? 'bg-success' : 'bg-warning'} text-white`}>
              {question.status === 'finished' ? '已回答' : '待回答'}
            </span>
            <span className="badge bg-secondary">{question.type}</span>
          </div>
          <div className="card-body">
            <h5 className="card-title fw-bold">{question.title}</h5>
            <p className="card-text text-muted">{question.username}</p>
          </div>
        </div>
      ))}

      {/* 分页导航 */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />

          {/* 只显示前 2 页 + 当前页 + 后 2 页 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
            .map((page, index, array) => (
              <>
                {index > 0 && array[index - 1] !== page - 1 && <Pagination.Ellipsis key={`ellipsis-${page}`} />}
                <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                  {page}
                </Pagination.Item>
              </>
            ))}

          <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
        </Pagination>
      )}
    </div>
  );
};

export default QuestionList;
