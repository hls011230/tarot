import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-5">
      <div className="container">
        <div className="row text-center">
          {/* 关于 */}
          <div className="col-md-3">
            <div className="fw-bold mb-3">关于</div>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-dark">关于我们</a></li>
              <li className="mb-2"><a href="#" className="text-dark">社区公约</a></li>
            </ul>
          </div>

          {/* 关注社区 */}
          <div className="col-md-3">
            <div className="fw-bold mb-3">合作</div>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-dark">广告投放</a></li>
              <li className="mb-2"><a href="#" className="text-dark">联系我们</a></li>
            </ul>
          </div>

          {/* 抖音号 */}
          <div className="col-md-3">
            <div className="fw-bold mb-3">抖音号</div>
            <img src="/static/douyin.png" alt="抖音二维码" className="img-fluid mb-3" style={{ maxWidth: '150px', height: 'auto' }} />
          </div>

          {/* 微信群 */}
          <div className="col-md-3">
            <div className="fw-bold mb-3">微信号</div>
            <img src="/static/wechat.png" alt="微信群二维码" className="img-fluid mb-3" style={{ maxWidth: '150px', height: 'auto' }} />
          </div>
        </div>

        <hr />

        {/* 版权信息 */}
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} 二梨工作室</p>
          <p className="mb-0">粤ICP备17140514号-1</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
