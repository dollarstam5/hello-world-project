import { describe, expect, it } from "vitest";
import { FLASH_MEDIA_LIMITS, validateFlashAttachment } from "@eco/core-db";

function file(name: string, size: number, type: string) {
  return new File([new Uint8Array(size)], name, { type });
}

describe("Flash local attachment validation", () => {
  it("allows supported image, video, audio and document MIME types within per-file limit", () => {
    for (const mime of [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "audio/mpeg",
      "audio/mp4",
      "audio/ogg",
      "audio/wav",
      "application/pdf",
      "text/plain",
    ]) {
      expect(validateFlashAttachment(file("test", 1, mime))).toBeNull();
    }
  });

  it("rejects active or unsupported file types", () => {
    for (const mime of [
      "image/svg+xml",
      "text/html",
      "application/zip",
      "application/octet-stream",
      "",
    ]) {
      expect(validateFlashAttachment(file("unsafe", 1, mime))).toBe("unsupported_type");
    }
  });

  it("rejects empty files and files over the size cap", () => {
    expect(validateFlashAttachment(file("empty.pdf", 0, "application/pdf"))).toBe("empty_file");
    expect(
      validateFlashAttachment(file("large.pdf", FLASH_MEDIA_LIMITS.maxFileBytes + 1, "application/pdf")),
    ).toBe("file_too_large");
  });

  it("accepts a file at the exact per-file limit", () => {
    expect(
      validateFlashAttachment(file("limit.pdf", FLASH_MEDIA_LIMITS.maxFileBytes, "application/pdf")),
    ).toBeNull();
  });
});
