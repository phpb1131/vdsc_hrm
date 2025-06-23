"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

const menu = [
    { label: "Nhân viên", path: "/employees" },
    { label: "Nghỉ phép", path: "/leaves" },
    { label: "Lương", path: "/salary" },
];

export default function MobileMenu() {
    const pathname = usePathname();

    return (
        <nav className="d-md-none bg-dark fixed-bottom w-100">
            <ul className="nav nav-justified">
                {menu.map((item) => (
                    <li className="nav-item" key={item.path}>
                        <Link
                            href={item.path}
                            className={`nav-link py-3 ${pathname.startsWith(item.path) ? "active" : "text-white"
                                }`}
                            aria-current={
                                pathname.startsWith(item.path) ? "page" : undefined
                            }
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
                <li className="nav-item">
                    <Link href="/logout" className="nav-link py-3 text-warning">
                        Đăng xuất
                    </Link>
                </li>
            </ul>
        </nav>
    );
}