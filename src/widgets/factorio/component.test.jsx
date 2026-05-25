// @vitest-environment jsdom

import { screen } from "@testing-library/react";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "test-utils/render-with-providers";

import Component from "./component";

const { useWidgetAPI } = vi.hoisted(() => ({
  useWidgetAPI: vi.fn(),
}));

vi.mock("utils/proxy/use-widget-api", () => ({
  default: useWidgetAPI,
}));

describe("widgets/factorio/component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("players data parses and renders", () => {
    useWidgetAPI.mockReturnValue({
      data: "Players (1):\n  username (online)\n  other-username",
      error: undefined,
    });

    const service = {
      widget: { type: "factorio" },
    };

    const { container } = renderWithProviders(<Component service={service} />, { settings: { hideErrors: false } });

    expect(screen.getByText("factorio.players")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
  });
  it("time data parses and renders", () => {
    const h = 86;
    const min = 46;
    const sec = 20;
    useWidgetAPI.mockReturnValue({
      data: `${h} hours, ${min} minutes and ${sec} seconds`,
      error: undefined,
    });

    const service = {
      widget: { type: "factorio" },
    };

    const { container } = renderWithProviders(<Component service={service} />, { settings: { hideErrors: false } });

    expect(screen.getByText("factorio.time")).toBeInTheDocument();

    expect(screen.getByText(h * 60 * 60 + min * 60 + sec)).toBeInTheDocument();
  });
  it("evolution data parses and renders", () => {
    useWidgetAPI.mockReturnValue({
      data: "Nauvis - Evolution factor: 0.9485. (Time 7%) (Pollution 82%) (Spawner kills 12%)\nVulcanus - Evolution factor: 0.3998. (Time 100%) (Pollution 0%) (Spawner kills 0%)\nFulgora - Evolution factor: 0.3156. (Time 100%) (Pollution 0%) (Spawner kills 0%)\nGleba - Evolution factor: 0.2622. (Time 90%) (Pollution 6%) (Spawner kills 4%)\n",
      error: undefined,
    });

    const service = {
      widget: { type: "factorio" },
    };

    const { container } = renderWithProviders(<Component service={service} />, { settings: { hideErrors: false } });

    expect(screen.queryAllByText("factorio.evolution")).toHaveLength(4);
    expect(screen.getByText("Nauvis: 0.9485.")).toBeInTheDocument();
    expect(screen.getByText("Vulcanus: 0.3998.")).toBeInTheDocument();
    expect(screen.getByText("Fulgora: 0.3156.")).toBeInTheDocument();
    expect(screen.getByText("Gleba: 0.2622.")).toBeInTheDocument();
  });
});
