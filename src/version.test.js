const fs = require("node:fs");
const path = require("node:path");

describe("getVersion()", () => {
  const { getVersion } = require("../dist/helpers/version.js");

  test("should return the version from package.json", () => {
    const pkgPath = path.resolve(__dirname, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const v = getVersion();

    expect(typeof v).toBe("string");
    expect(v).toBe(String(pkg.version));
    expect(v.length).toBeGreaterThan(0);
  });

  test("should not throw and always return a string", () => {
    expect(() => getVersion()).not.toThrow();
    const v = getVersion();
    expect(typeof v).toBe("string");
  });
});
