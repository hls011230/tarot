import { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";

const UserMenu = ({ user, logout, router }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="position-relative">
      {/* 用户头像按钮 */}
      <Button 
        variant="light" 
        className="d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm"
        onClick={() => setShow(!show)}
      >
        <img 
          src="/static/logo.png" 
          alt="User Avatar" 
          width="30" 
          height="30" 
          className="rounded-circle"
        />
        <span className="fw-bold">{user?.username || "未登录"}</span>
      </Button>

      {/* 下拉菜单 */}
      {show && (
        <div className="dropdown-menu show shadow-lg border-0 p-2 mt-2" style={{ minWidth: "200px", right: 0 }}>
          <button 
            className="dropdown-item fw-bold text-primary"
            onClick={() => {
              getUserinfo();
              setShow(false);
              router.replace("/");
            }}
          >
            个人信息
          </button>
          <button 
            className="dropdown-item fw-bold text-danger"
            onClick={() => {
              logout();
              setShow(false);
              router.replace("/?isLogin=false");
            }}
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
