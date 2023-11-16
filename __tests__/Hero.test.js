import React from "react";
import {
  render,
  cleanup,
  getByText,
  getByTestId,
  getByAltText,
  screen,
  getByRole,
  getByTagName,
} from "@testing-library/react";
import Hero from "../components/Hero";
import Skeleton from "../components/Skeleton";
import { afterEach } from "node:test";

afterEach(cleanup);

describe("Hero", () => {
  test("renders skeleton when mounted is false", () => {
    render(<Hero />);
    render(<Skeleton />);

    const skeletonElement = screen.getByTestId("skeleton");

    expect(skeletonElement).toBeInTheDocument();
  });

  test("renders hero section when mounted is true", () => {
    const { getByTestId } = render(<Hero />);

    const heroSection = getByTestId("hero-section");

    expect(heroSection).toBeInTheDocument();
  });

  test("renders hero title", () => {
    render(<Hero />);

    const heroTitle = screen.getByText("Frontend Developer");

    expect(heroTitle).toBeInTheDocument();
  });

  test("renders hero description", () => {
    render(<Hero />);

    const heroDescription = screen.getByText(
      "Building beautiful, user-friendly experiences with cutting-edge technology.",
    );

    expect(heroDescription).toBeInTheDocument();
  });

  test("renders resume link", () => {
    render(<Hero />);

    const resumeLink = screen.getByText("Resume");

    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute("href", "/Yunior_Batista_Resume.pdf");
    expect(resumeLink).toHaveAttribute("target", "_blank");
    expect(resumeLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("renders hero image", () => {
    render(<Hero />);

    const heroImage = screen.getByAltText("mockup");
    const heroAttribute = heroImage.getAttribute("src");
    expect(heroAttribute).toContain("hero-developer.png");
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("width", "500");
    expect(heroImage).toHaveAttribute("height", "100");
    expect(heroImage).toHaveClass("image");
  });
});
