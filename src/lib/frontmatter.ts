/*
 * Frontmatter arrives untyped from YAML. A malformed content file should fail
 * the build naming the file and the field, rather than render a page full of
 * `undefined`. The reader binds the source path once so every call site reads
 * as a plain field assertion.
 */

export interface FrontmatterReader {
  requireString: (value: unknown, field: string) => string;
  requireNumber: (value: unknown, field: string) => number;
  requireDate: (value: unknown, field: string) => Date;
  readStringList: (value: unknown, field: string) => string[];
  readRecordList: (value: unknown, field: string) => Record<string, unknown>[];
}

export const createFrontmatterReader = (
  sourcePath: string,
): FrontmatterReader => {
  const invalid = (field: string, expected: string) =>
    new Error(`${sourcePath}: "${field}" must be ${expected}`);

  const requireString = (value: unknown, field: string): string => {
    if (typeof value !== "string" || value.trim() === "") {
      throw invalid(field, "a non-empty string");
    }
    return value;
  };

  const requireNumber = (value: unknown, field: string): number => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw invalid(field, "a number");
    }
    return value;
  };

  /*
   * An unquoted `2026-09-27` reaches us as a Date because YAML types it; a
   * quoted one stays a string. Both are reasonable to write, so both parse.
   */
  const requireDate = (value: unknown, field: string): Date => {
    const parsed = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(parsed.getTime())) {
      throw invalid(field, "a YYYY-MM-DD date");
    }
    return parsed;
  };

  const readStringList = (value: unknown, field: string): string[] => {
    if (value === undefined) {
      return [];
    }
    if (
      !Array.isArray(value) ||
      value.some((item) => typeof item !== "string")
    ) {
      throw invalid(field, "a list of strings");
    }
    return value;
  };

  const readRecordList = (
    value: unknown,
    field: string,
  ): Record<string, unknown>[] => {
    if (value === undefined) {
      return [];
    }
    if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
      throw invalid(field, "a list of objects");
    }
    return value;
  };

  return {
    requireString,
    requireNumber,
    requireDate,
    readStringList,
    readRecordList,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
