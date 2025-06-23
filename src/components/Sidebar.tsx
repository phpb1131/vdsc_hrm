"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthService } from "../utils/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/sidebar.css";

const menu = [
  { label: "Nhân viên", path: "/employees" },
  { label: "Nghỉ phép", path: "/leaves" },
  { label: "Lương", path: "/salary" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // Để đóng sidebar sau khi bấm chọn menu (trên mobile)
  const handleNavClick = () => setShow(false);

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <>
      {/* Nút toggle (hamburger) chỉ hiện trên mobile và tablet */}
      <button
        className="btn btn-dark d-md-none m-2"
        type="button"
        onClick={() => setShow(true)}
        aria-label="Mở menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
        </svg>
      </button>

      {/* Sidebar dạng offcanvas cho mobile & dạng cố định cho desktop */}
      {/* Desktop: d-none d-md-flex | Mobile: d-block d-md-none */}
      <div
        className={`sidebar bg-dark text-white ${show ? "show-mobile" : ""
          } d-none d-md-flex flex-column position-fixed top-0 start-0 vh-100`}
        style={{ width: 210, zIndex: 1045 }}
      >
        <div className="sidebar-brand text-center py-3 fs-4 fw-bold border-bottom">
          <Link href="/" className="text-white text-decoration-none" onClick={handleNavClick}>
            HRM
          </Link>
        </div>
        <ul className="nav nav-pills flex-column mt-3">
          {menu.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                href={item.path}
                className={`nav-link px-4 py-2 ${pathname.startsWith(item.path) ? "active" : "text-white"
                  }`}
                aria-current={pathname.startsWith(item.path) ? "page" : undefined}
                onClick={handleNavClick}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="nav-item mt-auto">
            <button
              className="nav-link px-4 py-2 text-warning bg-transparent border-0 w-100 text-start"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>

      {/* Offcanvas sidebar cho mobile/tablet */}
      {show && (
        <div className="offcanvas-backdrop d-md-none show" onClick={() => setShow(false)} />
      )}
      <div
        className={`sidebar offcanvas-mobile bg-dark text-white d-block d-md-none ${show ? "show-mobile" : ""
          }`}
        style={{ width: 210, zIndex: 1050 }}
      >
        <div className="sidebar-brand text-center py-3 fs-4 fw-bold border-bottom">
          <button
            className="btn btn-link text-white float-end"
            onClick={() => setShow(false)}
            aria-label="Đóng menu"
            style={{ fontSize: 28 }}
          >
            &times;
          </button>
          <Link href="/" className="text-white text-decoration-none" onClick={handleNavClick}>
            HRM
          </Link>
        </div>
        <ul className="nav nav-pills flex-column mt-3">
          {menu.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                href={item.path}
                className={`nav-link px-4 py-2 ${pathname.startsWith(item.path) ? "active" : "text-white"
                  }`}
                aria-current={pathname.startsWith(item.path) ? "page" : undefined}
                onClick={handleNavClick}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="nav-item mt-auto">
            <button
              className="nav-link px-4 py-2 text-warning bg-transparent border-0 w-100 text-start"
              onClick={() => { handleLogout(); handleNavClick(); }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}