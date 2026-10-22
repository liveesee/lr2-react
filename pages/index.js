import Head from "next/head";
import PropTypes from "prop-types";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import { articles } from "@/data/articles";

export async function getServerSideProps() {
  return {
    props: {
      articles: articles.map(({ content, ...preview }) => preview),
      renderedAt: new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }),
    },
  };
}

export default function Home({ articles, renderedAt }) {
  return (
    <>
      <Head>
        <title>FOLIA — блог</title>
      </Head>
      <div className="page">
        <SiteHeader />
        <p className="note">Свежие публикации на {renderedAt} (страница собрана на сервере)</p>
        <main className="list">
          {articles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </main>
      </div>
    </>
  );
}

Home.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderedAt: PropTypes.string.isRequired,
};
