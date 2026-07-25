export interface CompletedGamePanelProps {
  readonly onReset: () => void | Promise<void>;
  readonly onShowResults: () => void;
}

export interface Countdown {
  readonly formatted: string;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}
