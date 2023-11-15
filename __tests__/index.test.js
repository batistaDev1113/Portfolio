import { render, screen } from "@testing-library/react";
import Hero from "../components/Hero";
import Skeleton from "../components/Skeleton";

describe("Checks for components loading", () => {
  it("renders a skeleton loader", () => {
    render(<Skeleton />);
    const text = screen.getByText(/loading.../i);
    expect(text).toBeInTheDocument();
  });
  it("renders a hero component", () => {
    render(<Hero />);
    const heading = screen.getByText(/Frontend Developer/i);
    expect(heading).toBeInTheDocument();
  });
});
