import { render, screen, within } from "@testing-library/react";
import Stats from "@/pages/stats";
import { fetchTopMovies } from "@/lib/api";

jest.mock("@/lib/api", () => ({ fetchTopMovies: jest.fn() }));
jest.mock("next/router", () => ({ useRouter: () => ({ pathname: "/stats" }) }));
jest.mock("next/dynamic", () => () => {
  function ChartStub({ items, description }) {
    return <div role="img" aria-label={description} data-bars={items.length} />;
  }
  return ChartStub;
});

const response = {
  metric: "Средняя оценка пользователей, шкала 1–10",
  limit: 10,
  minVotes: 20,
  totalMovies: 18,
  totalRatings: 3354,
  items: [
    { id: "1", title: "Побег из Шоушенка", year: 1994, rating: 9.07, votes: 240, genres: ["драма"] },
    { id: "2", title: "Зелёная миля", year: 1999, rating: 8.94, votes: 190, genres: ["драма"] },
  ],
};

describe("Страница статистики", () => {
  beforeEach(() => jest.clearAllMocks());

  it("запрашивает топ-10 и передаёт данные в график", async () => {
    fetchTopMovies.mockResolvedValue(response);
    render(<Stats />);

    const chart = await screen.findByRole("img");
    expect(fetchTopMovies).toHaveBeenCalledWith({ limit: 10 });
    expect(chart).toHaveAttribute("data-bars", "2");
    expect(chart).toHaveAccessibleName(expect.stringContaining("Первое место — Побег из Шоушенка (1994), 9.07 из 10"));
    expect(screen.getByText(/По 3354 оценкам 18 фильмов/)).toBeInTheDocument();
    expect(screen.getByText(/не меньше 20 оценок/)).toBeInTheDocument();
  });

  it("дублирует данные графика таблицей", async () => {
    fetchTopMovies.mockResolvedValue(response);
    render(<Stats />);

    const table = await screen.findByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent("1Побег из Шоушенка (1994)9.07240");
  });

  it("сообщает об ошибке загрузки", async () => {
    fetchTopMovies.mockRejectedValue(new Error("500"));
    render(<Stats />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Не удалось загрузить статистику");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("показывает пустое состояние без графика", async () => {
    fetchTopMovies.mockResolvedValue({ ...response, items: [] });
    render(<Stats />);

    expect(await screen.findByText("Пока недостаточно оценок для рейтинга.")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("отмечает раздел в навигации", () => {
    fetchTopMovies.mockReturnValue(new Promise(() => {}));
    render(<Stats />);

    const nav = screen.getByRole("navigation", { name: "Разделы сайта" });
    expect(within(nav).getByRole("link", { name: "Статистика" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Статьи" })).not.toHaveAttribute("aria-current");
  });
});
