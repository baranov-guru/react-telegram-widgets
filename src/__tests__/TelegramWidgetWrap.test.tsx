import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TelegramWidgetWrap from "../TelegramWidgetWrap";
import { TelegramScriptElement } from "../types";

// Mock script element
const createMockScript = (): TelegramScriptElement => {
  const script = document.createElement("script") as TelegramScriptElement;
  script.async = false;
  script.src = "";
  script.setAttribute = jest.fn();
  script.onerror = null;
  script.onload = null;
  script._iframe = undefined;

  return script;
};

// Mock iframe element
const createMockIframe = (): HTMLIFrameElement => {
  const iframe = document.createElement("iframe");
  iframe.onerror = null;
  iframe.onload = null;
  return iframe;
};

describe("TelegramWidgetWrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render a div with the provided className", () => {
      const createScript = jest.fn(() => createMockScript());
      const className = "test-class";

      render(
        <TelegramWidgetWrap createScript={createScript} className={className} />
      );

      const div = screen.getByTestId("telegram-widget-wrap");
      expect(div).toHaveClass(className);
    });

    it("should render without className when not provided", () => {
      const createScript = jest.fn(() => createMockScript());

      render(<TelegramWidgetWrap createScript={createScript} />);

      const div = screen.getByTestId("telegram-widget-wrap");
      expect(div).toBeInTheDocument();
    });
  });

  describe("Script creation and attachment", () => {
    it("should call createScript function", () => {
      const createScript = jest.fn(() => createMockScript());

      render(<TelegramWidgetWrap createScript={createScript} />);

      expect(createScript).toHaveBeenCalledTimes(1);
    });

    it("should handle createScript throwing an error", () => {
      const error = new Error("Script creation failed");
      const createScript = jest.fn(() => {
        throw error;
      });
      const onError = jest.fn();

      render(
        <TelegramWidgetWrap createScript={createScript} onError={onError} />
      );

      expect(createScript).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe("Error handling", () => {
    it("should call onError when script.onerror is triggered", () => {
      const mockScript = createMockScript();
      const createScript = jest.fn(() => mockScript);
      const onError = jest.fn();

      render(
        <TelegramWidgetWrap createScript={createScript} onError={onError} />
      );

      // Simulate script error
      const error = new Error("Script load failed");
      mockScript.onerror?.(error as any);

      expect(onError).toHaveBeenCalledWith(error);
    });

    it("should not call onError when script.onerror is triggered but onError is not provided", () => {
      const mockScript = createMockScript();
      const createScript = jest.fn(() => mockScript);

      render(<TelegramWidgetWrap createScript={createScript} />);

      // Simulate script error
      const error = new Error("Script load failed");
      expect(() => mockScript.onerror?.(error as any)).not.toThrow();
    });
  });

  describe("Load handling", () => {
    it("should not call onLoad when script.onload is triggered but iframe does not exist", () => {
      const mockScript = createMockScript();
      mockScript._iframe = undefined;

      const createScript = jest.fn(() => mockScript);
      const onLoad = jest.fn();

      render(
        <TelegramWidgetWrap createScript={createScript} onLoad={onLoad} />
      );

      // Simulate script load
      act(() => {
        mockScript.onload?.(new Event("load"));
      });

      expect(onLoad).not.toHaveBeenCalled();
    });

    it("should not set iframe error handler when onError is not provided", () => {
      const mockScript = createMockScript();
      const mockIframe = createMockIframe();
      mockScript._iframe = mockIframe;

      const createScript = jest.fn(() => mockScript);

      render(<TelegramWidgetWrap createScript={createScript} />);

      // Simulate script load to trigger iframe setup
      act(() => {
        mockScript.onload?.(new Event("load"));
      });

      expect(mockIframe.onerror).toBeNull();
    });
  });

  describe("Dependencies and re-renders", () => {
    it("should recreate script when createScript function changes", () => {
      const createScript1 = jest.fn(() => createMockScript());
      const createScript2 = jest.fn(() => createMockScript());

      const { rerender } = render(
        <TelegramWidgetWrap createScript={createScript1} />
      );

      expect(createScript1).toHaveBeenCalledTimes(1);

      rerender(<TelegramWidgetWrap createScript={createScript2} />);

      expect(createScript2).toHaveBeenCalledTimes(1);
    });

    it("should not recreate script when other props change", () => {
      const createScript = jest.fn(() => createMockScript());

      const { rerender } = render(
        <TelegramWidgetWrap createScript={createScript} />
      );

      expect(createScript).toHaveBeenCalledTimes(1);

      rerender(
        <TelegramWidgetWrap createScript={createScript} className="new-class" />
      );

      expect(createScript).toHaveBeenCalledTimes(1);
    });
  });
});
