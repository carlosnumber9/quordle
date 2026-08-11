export type GameMode = "daily" | "local";

export interface GamePayload {
  readonly gameId: string;
  readonly gameDate: string;
  readonly words: ReadonlyArray<string>;
  readonly mode: GameMode;
  readonly replayAllowed: boolean;
}

export type WordCategory =
  | "adjective"
  | "adverb"
  | "article"
  | "conjunction"
  | "interjection"
  | "noun"
  | "preposition"
  | "pronoun"
  | "verb";

export interface WordReading {
  readonly displayedForm: string;
  readonly lemma: string;
  readonly category: WordCategory;
  readonly homonymIndex: number | null;
  readonly grammaticalForms: ReadonlyArray<string>;
  readonly definition: string;
  readonly labels: ReadonlyArray<string>;
}

export interface WordDefinitionPayload {
  readonly word: string;
  readonly readings: ReadonlyArray<WordReading>;
}
