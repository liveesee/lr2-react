import { fireEvent, render, screen } from "@testing-library/react";
import CommentInput from "@/components/CommentInput/CommentInput";
import { fetchComments, postComment } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  fetchComments: jest.fn(),
  postComment: jest.fn(),
}));

describe("CommentInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchComments.mockResolvedValue([]);
  });

  it("загружает комментарии статьи из API", async () => {
    fetchComments.mockResolvedValue([
      { _id: "1", author: "Анна", text: "Хороший текст", createdAt: new Date().toISOString() },
    ]);

    render(<CommentInput article="olive-ink" />);

    expect(await screen.findByText("Хороший текст")).toBeInTheDocument();
    expect(fetchComments).toHaveBeenCalledWith("olive-ink");
  });

  it("выводит форматирование, но не выполняет HTML-атаку из ответа API", async () => {
    window.alert = jest.fn();
    fetchComments.mockResolvedValue([
      {
        _id: "xss",
        author: "Вы",
        text: `Отличная статья <b>спасибо</b>! <img src=x onerror="alert('XSS PoC')"><script>alert(1)</script>`,
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<CommentInput article="olive-ink" />);

    const bold = await screen.findByText("спасибо");
    const text = bold.closest("p");
    expect(bold.tagName).toBe("B");
    expect(text.innerHTML).toBe("Отличная статья <b>спасибо</b>! ");
    expect(text.querySelector("img, script, [onerror]")).toBeNull();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("отправляет комментарий и показывает его в списке", async () => {
    postComment.mockResolvedValue({
      _id: "2",
      author: "Вы",
      text: "Спасибо за статью",
      createdAt: new Date().toISOString(),
    });

    render(<CommentInput article="olive-ink" />);
    fireEvent.change(screen.getByLabelText("Текст комментария"), {
      target: { value: "Спасибо за статью" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));

    const list = await screen.findByRole("list", { name: "Комментарии" });
    expect(list).toHaveTextContent("Спасибо за статью");
    expect(postComment).toHaveBeenCalledWith("olive-ink", "Спасибо за статью");
  });

  it("показывает причину, по которой сервер отклонил комментарий", async () => {
    postComment.mockRejectedValue(
      Object.assign(new Error("400"), { reason: "Поле text не содержит текста после очистки HTML" }),
    );

    render(<CommentInput article="olive-ink" />);
    fireEvent.change(screen.getByLabelText("Текст комментария"), {
      target: { value: "<img src=x onerror=alert(1)>" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Комментарий отклонён: Поле text не содержит текста после очистки HTML",
    );
  });

  it("не отправляет пустой комментарий и показывает ошибку", async () => {
    render(<CommentInput article="olive-ink" />);

    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));

    expect(await screen.findByText("Ошибка · добавьте пару слов")).toBeInTheDocument();
    expect(postComment).not.toHaveBeenCalled();
  });

  it("связывает поле с меткой и ошибкой, возвращает фокус в поле", async () => {
    render(<CommentInput article="olive-ink" />);
    const input = screen.getByLabelText("Текст комментария");

    expect(input.tagName).toBe("INPUT");
    expect(input).not.toHaveAttribute("aria-invalid", "true");

    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Ошибка · добавьте пару слов");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(expect.stringContaining("Ошибка · добавьте пару слов"));
    expect(input).toHaveFocus();
  });
});
