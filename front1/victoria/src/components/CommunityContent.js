import React from 'react';

const CommunityContent = () => {
  return (
<div className="community-content card shadow-sm border-0 p-4">

  {/* 提问按钮区域 */}
  <div className="text-center mb-5">
    <button className="btn btn-primary btn-lg px-2">
    <a href="/ask" className="text-decoration-none text-white ">
        我要提问
    </a>
    </button>
  </div>

  {/* 社区联系人区域 */}
  <div className="card p-3 bg-light">
    <h5 className="mb-3"></h5>
    <ul className="list-unstyled">
      <li className="mb-2">
        <a href="#" className="text-decoration-none text-primary fw-bold">
          🔹 加入我们的社群
        </a>
      </li>
      <li className="mb-2">
        <a href="#" className="text-decoration-none text-primary fw-bold">
          💬 联系我们
        </a>
      </li>
      <li className="mb-2">
        <a href="#" className="text-decoration-none text-primary fw-bold">
          🐦 关注我们
        </a>
      </li>
    </ul>
  </div>
</div>

  );
};

export default CommunityContent;