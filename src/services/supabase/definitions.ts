export class MissingServerConfigurationError extends Error {
  constructor(readonly variableNames: ReadonlyArray<string>) {
    super(
      `Faltan variables de entorno obligatorias: ${variableNames.join(", ")}.`,
    );
    this.name = "MissingServerConfigurationError";
  }
}
