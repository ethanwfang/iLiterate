import { describe, expect, it } from "vitest";
import { isHiddenFeaturePath } from "@/lib/features";

describe("isHiddenFeaturePath", () => {
  it.each(["/study-chat", "/study-chat/abc", "/karaoke", "/karaoke/1", "/api/karaoke/content/1", "/api/study-chat"])(
    "hides %s",
    (path) => expect(isHiddenFeaturePath(path)).toBe(true)
  );

  it.each(["/library", "/reader/1", "/karaokes", "/api/tts", "/study-chatter"])("keeps %s", (path) =>
    expect(isHiddenFeaturePath(path)).toBe(false)
  );
});
