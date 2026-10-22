import Link from "next/link"
import { Logo } from "../icons.jsx"
import styles from "./SiteHeader.module.css"

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <Logo />
        <span className={styles.word}>FOLIA</span>
      </Link>
      <p className={styles.tagline}>Редакционный блог</p>
    </header>
  )
}
