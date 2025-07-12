export type TelegramScriptElement = HTMLScriptElement & {
  _iframe: HTMLIFrameElement | undefined;
};

export type TelegramWidgetCommonProps = {
  /**
   * Optional CSS class for the container div.
   */
  className?: string;
  /**
   * Optional callback invoked when the widget loads successfully.
   */
  onLoad?: () => void;
  /**
   * Optional callback invoked when an error occurs during widget loading.
   */
  onError?: (e: unknown) => void;
};
