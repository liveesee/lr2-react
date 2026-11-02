import { buildTopMoviesChart, movieLabel, wrapLabel } from "@/lib/topMoviesChart";

const items = [
  { id: "1", title: "Побег из Шоушенка", year: 1994, rating: 9.07, votes: 240, genres: ["драма"] },
  { id: "2", title: "Зелёная миля", year: 1999, rating: 8.94, votes: 190, genres: ["драма", "фэнтези"] },
];

describe("buildTopMoviesChart", () => {
  const { data, layout, config } = buildTopMoviesChart(items);
  const [trace] = data;

  it("строит горизонтальную столбчатую диаграмму", () => {
    expect(data).toHaveLength(1);
    expect(trace.type).toBe("bar");
    expect(trace.orientation).toBe("h");
    expect(trace.x).toEqual([9.07, 8.94]);
    expect(trace.y).toEqual(["Побег из Шоушенка (1994)", "Зелёная миля (1999)"]);
  });

  it("показывает лидера сверху и шкалу от нуля", () => {
    expect(layout.yaxis.autorange).toBe("reversed");
    expect(layout.xaxis.range).toEqual([0, 10]);
  });

  it("даёт названия графику и осям, без легенды и панели инструментов", () => {
    expect(layout.title.text).toBe("Топ-10 фильмов по средней оценке пользователей");
    expect(layout.xaxis.title.text).toBe("Средняя оценка (шкала 1–10)");
    expect(layout.yaxis.title.text).toBe("Фильм (год выпуска)");
    expect(layout.showlegend).toBe(false);
    expect(config.displayModeBar).toBe(false);
  });

  it("передаёт в подсказку число оценок и жанры", () => {
    expect(trace.customdata[1]).toEqual(["Зелёная миля", 1999, 190, "драма, фэнтези"]);
    expect(trace.hovertemplate).toContain("Оценок: %{customdata[2]}");
    expect(trace.hovertemplate).toContain("Жанры: %{customdata[3]}");
    expect(trace.text).toEqual(["9.07", "8.94"]);
  });

  it("формирует подпись фильма с годом", () => {
    expect(movieLabel(items[0])).toBe("Побег из Шоушенка (1994)");
  });

  it("на узком экране переносит длинные подписи и сокращает оформление", () => {
    expect(wrapLabel("Властелин колец: Возвращение короля (2003)", 16)).toBe(
      "Властелин колец:<br>Возвращение<br>короля (2003)",
    );
    const compact = buildTopMoviesChart(items, { compact: true });
    expect(compact.data[0].y).toEqual(["Побег из<br>Шоушенка (1994)", "Зелёная миля<br>(1999)"]);
    expect(compact.layout.yaxis.title.text).toBe("");
    expect(compact.layout.xaxis.dtick).toBe(2);
  });
});
