import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "../styles/data-components.css";
import "../styles/sidebar.css";
import "../styles/responsive-data-view.css";

export const metadata = {
  title: "Quản lý nhân sự - HRM",
  description: "Ứng dụng quản lý nhân sự đơn giản với Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Sidebar />
        <div
          className="main-content"
          style={{
            marginLeft: 210,
            padding: 24,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {children}
        </div>
        <style>
          {`
            @media (max-width: 767.98px) {
              .main-content {
                margin-left: 0 !important;
              }
            }
          `}
        </style>
      </body>
    </html>
  );
}
