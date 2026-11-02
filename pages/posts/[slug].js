import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import CommentInput from "@/components/CommentInput/CommentInput";
import LikeButton from "@/components/LikeButton/LikeButton";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import { Avatar } from "@/components/icons";
import { articles } from "@/data/articles";
import styles from "@/styles/Post.module.css";

export async function getStaticPaths() {
  return {
    paths: articles.map((article) => ({ params: { slug: article.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = articles.find((item) => item.slug === params.slug);

  return {
    props: {
      article,
      generatedAt: new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }),
    },
  };
}

export default function Post({ article, generatedAt }) {
  return (
    <>
      <Head>
        <title>{`${article.title} — FOLIA`}</title>
      </Head>
      <div className={styles.page}>
        <SiteHeader />
        <main id="content" tabIndex={-1}>
          <Link href="/" className={styles.back}>
            <span aria-hidden="true">← </span>Все статьи
          </Link>
          <article aria-labelledby="post-title">
            <Image
              className={styles.cover}
              src={article.imageUrl}
              alt={article.imageAlt}
              width={1200}
              height={600}
              priority
            />
            <div className={styles.meta}>
              <Avatar />
              <div>
                <p className={styles.author}>{article.author}</p>
                <p className={styles.minutes}>{article.minutes} мин</p>
              </div>
            </div>
            <h1 className={styles.title} id="post-title">
              {article.title}
            </h1>
            {article.content.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
            <p className={styles.generated}>Страница сгенерирована при сборке: {generatedAt}</p>
            <LikeButton />
            <hr className={styles.divider} />
            <section aria-labelledby="comments-title">
              <h2 id="comments-title" className="visually-hidden">
                Комментарии
              </h2>
              <CommentInput article={article.slug} />
            </section>
          </article>
        </main>
      </div>
    </>
  );
}

Post.propTypes = {
  article: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    content: PropTypes.arrayOf(PropTypes.string).isRequired,
    imageUrl: PropTypes.string.isRequired,
    imageAlt: PropTypes.string.isRequired,
    minutes: PropTypes.number.isRequired,
  }).isRequired,
  generatedAt: PropTypes.string.isRequired,
};
