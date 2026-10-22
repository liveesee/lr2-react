import { fireEvent, render, screen } from "@testing-library/react";
import LikeButton from "@/components/LikeButton/LikeButton";

describe("LikeButton", () => {
  it("рендерится с нулевым счётчиком", () => {
    render(<LikeButton />);
    expect(screen.getByRole("button", { name: "Нравится" })).toHaveTextContent("0");
  });

  it("увеличивает счётчик лайков на 1 при клике", () => {
    render(<LikeButton />);
    const button = screen.getByRole("button", { name: "Нравится" });

    fireEvent.click(button);

    expect(button).toHaveTextContent("1");
  });

  it("каждый клик прибавляет ровно один лайк к начальному значению", () => {
    render(<LikeButton initialCount={5} />);
    const button = screen.getByRole("button", { name: "Нравится" });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(button).toHaveTextContent("7");
  });
});
