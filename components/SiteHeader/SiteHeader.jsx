import Link from "next/link"
import { useRouter } from "next/router"
import { Logo } from "../icons.jsx"
import styles from "./SiteHeader.module.css"

const links = [
  { href: "/", label: "Статьи" },
  { href: "/stats", label: "Статистика" },
]

export default function SiteHeader() {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      <a href="#content" className="skip-link">
        Перейти к содержимому
      </a>
      <div className={styles.top}>
        <Link href="/" className={styles.brand}>
          <Logo />
          <span className={styles.word}>FOLIA</span>
        </Link>
        <nav aria-label="Разделы сайта">
          <ul className={styles.nav}>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.navLink}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className={styles.tagline}>Редакционный блог</p>
    </header>
  )
}
