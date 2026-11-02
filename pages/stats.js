import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import { fetchTopMovies } from "@/lib/api";
import { movieLabel } from "@/lib/topMoviesChart";
import styles from "@/styles/Stats.module.css";

const TopMoviesChart = dynamic(() => import("@/components/TopMoviesChart/TopMoviesChart"), {
  ssr: false,
  loading: () => <p className={styles.state}>Загрузка графика…</p>,
});

function describe(stats) {
  const [first] = stats.items;
  return `Горизонтальная столбчатая диаграмма: ${stats.items.length} фильмов с самой высокой средней оценкой. Первое место — ${movieLabel(first)}, ${first.rating} из 10.`;
}

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchTopMovies({ limit: 10 })
      .then((result) => {
        if (active) setStats(result);
      })
      .catch(() => {
        if (active) setError("Не удалось загрузить статистику. Проверьте, что API запущен.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Статистика — FOLIA</title>
      </Head>
      <div className="page">
        <SiteHeader />
        <main id="content" tabIndex={-1} className={styles.main}>
          <h1 className={styles.title}>Статистика</h1>
          <p className={styles.lead}>
            Фильмы с самой высокой средней оценкой пользователей. Учитываются фильмы, у которых
            {stats ? ` не меньше ${stats.minVotes} оценок` : " достаточно оценок"}.
          </p>

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          {!stats && !error ? <p className={styles.state}>Загрузка данных…</p> : null}
          {stats && stats.items.length === 0 ? <p className={styles.state}>Пока недостаточно оценок для рейтинга.</p> : null}

          {stats && stats.items.length > 0 ? (
            <figure className={styles.figure}>
              <TopMoviesChart items={stats.items} description={describe(stats)} />
              <figcaption className={styles.caption}>
                По {stats.totalRatings} оценкам {stats.totalMovies} фильмов. Наведите на столбец, чтобы увидеть число
                оценок и жанры.
              </figcaption>
              <details className={styles.details}>
                <summary>Данные графика таблицей</summary>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Место</th>
                      <th scope="col">Фильм</th>
                      <th scope="col">Средняя оценка</th>
                      <th scope="col">Оценок</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.items.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{movieLabel(item)}</td>
                        <td>{item.rating.toFixed(2)}</td>
                        <td>{item.votes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </figure>
          ) : null}
        </main>
      </div>
    </>
  );
}
