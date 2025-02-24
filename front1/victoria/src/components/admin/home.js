import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
const HomeDashboard = () => {
  const [stats, setStats] = useState({
    users: 1200,
    views: 30500,
    orders: 450,
  });

  const [chartData, setChartData] = useState({
    labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    datasets: [
      {
        label: "网站访问量",
        data: [500, 800, 1200, 1500, 1100, 950, 1300],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  });

  useEffect(() => {
    // 这里可以添加 API 请求，获取实际数据
  }, []);

  return (
    <Container fluid>
      <h2 className="mb-4">首页</h2>
    </Container>
  );
};

export default HomeDashboard;
