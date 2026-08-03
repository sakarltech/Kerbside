/**
 * Component tests for MatchCard.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import MatchCard from "@/components/matching/MatchCard";

// Mock Next.js Link component
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock lucide-react
jest.mock("lucide-react", () => ({
  CheckCircle: ({ className }: { className: string }) => (
    <svg data-testid="check-circle" className={className} />
  ),
}));

// Mock Avatar component
jest.mock("@/components/ui/Avatar", () => {
  return function MockAvatar({ name }: { name: string }) {
    return <div data-testid="avatar">{name}</div>;
  };
});

// Mock Button component
jest.mock("@/components/ui/Button", () => {
  return function MockButton({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant: string;
  }) {
    return <button data-variant={variant}>{children}</button>;
  };
});

describe("MatchCard", () => {
  const defaultProps = {
    id: "inst-1",
    name: "Sarah Jones",
    score: 92,
    hourlyRate: 35,
    matchFactors: ["Location match", "Same gender", "Anxiety-friendly"],
    avatar: null,
  };

  it("should render instructor name", () => {
    render(<MatchCard {...defaultProps} />);
    expect(screen.getByText("Sarah Jones")).toBeInTheDocument();
  });

  it("should render score percentage", () => {
    render(<MatchCard {...defaultProps} />);
    expect(screen.getByText("92%")).toBeInTheDocument();
  });

  it("should render hourly rate", () => {
    render(<MatchCard {...defaultProps} />);
    expect(screen.getByText(/35\/hr/)).toBeInTheDocument();
  });

  it("should render match factor indicators", () => {
    render(<MatchCard {...defaultProps} />);

    expect(screen.getByText("Location match")).toBeInTheDocument();
    expect(screen.getByText("Same gender")).toBeInTheDocument();
    expect(screen.getByText("Anxiety-friendly")).toBeInTheDocument();

    // Green check icons should be present
    const checkIcons = screen.getAllByTestId("check-circle");
    expect(checkIcons.length).toBe(3);
    checkIcons.forEach((icon) => {
      expect(icon).toHaveClass("text-green-500");
    });
  });

  it("should render 'View Profile' button linking to instructor profile", () => {
    render(<MatchCard {...defaultProps} />);

    const viewProfileButton = screen.getByText("View Profile");
    expect(viewProfileButton).toBeInTheDocument();

    // Check the link wrapping it
    const link = viewProfileButton.closest("a");
    expect(link).toHaveAttribute("href", "/instructors/inst-1");
  });

  it("should render 'Book Now' button linking to booking page", () => {
    render(<MatchCard {...defaultProps} />);

    const bookNowButton = screen.getByText("Book Now");
    expect(bookNowButton).toBeInTheDocument();

    // Check the link wrapping it
    const link = bookNowButton.closest("a");
    expect(link).toHaveAttribute("href", "/booking/inst-1");
  });

  it("should handle empty matchFactors array", () => {
    render(<MatchCard {...defaultProps} matchFactors={[]} />);

    // No check icons should be rendered
    const checkIcons = screen.queryAllByTestId("check-circle");
    expect(checkIcons.length).toBe(0);
  });
});
