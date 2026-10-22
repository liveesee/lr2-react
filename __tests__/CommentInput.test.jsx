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

  it("не отправляет пустой комментарий и показывает ошибку", async () => {
    render(<CommentInput article="olive-ink" />);

    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));

    expect(await screen.findByText("Ошибка · добавьте пару слов")).toBeInTheDocument();
    expect(postComment).not.toHaveBeenCalled();
  });
});
