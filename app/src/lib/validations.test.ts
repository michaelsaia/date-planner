import { describe, it, expect } from "vitest";
import {
  profileSchema,
  filterSchema,
  moodSchema,
  budgetRangeSchema,
  signUpSchema,
  loginSchema,
} from "./validations";

describe("validations", () => {
  describe("signUpSchema", () => {
    it("accepts valid signup data", () => {
      const result = signUpSchema.parse({ email: "test@example.com", password: "password123" });
      expect(result.email).toBe("test@example.com");
    });

    it("rejects invalid email", () => {
      expect(() => signUpSchema.parse({ email: "notanemail", password: "password123" })).toThrow();
    });

    it("rejects short password", () => {
      expect(() => signUpSchema.parse({ email: "test@example.com", password: "short" })).toThrow();
    });
  });

  describe("loginSchema", () => {
    it("accepts valid login data", () => {
      const result = loginSchema.parse({ email: "test@example.com", password: "x" });
      expect(result.email).toBe("test@example.com");
    });

    it("rejects empty password", () => {
      expect(() => loginSchema.parse({ email: "test@example.com", password: "" })).toThrow();
    });
  });

  describe("moodSchema", () => {
    it("accepts valid moods", () => {
      expect(moodSchema.parse("romantic")).toBe("romantic");
      expect(moodSchema.parse("adventurous")).toBe("adventurous");
    });

    it("rejects invalid moods", () => {
      expect(() => moodSchema.parse("boring")).toThrow();
    });
  });

  describe("budgetRangeSchema", () => {
    it("accepts valid range", () => {
      const result = budgetRangeSchema.parse({ min: 10, max: 50 });
      expect(result).toEqual({ min: 10, max: 50 });
    });

    it("rejects max < min", () => {
      expect(() => budgetRangeSchema.parse({ min: 50, max: 10 })).toThrow();
    });
  });

  describe("profileSchema", () => {
    it("accepts valid profile", () => {
      const result = profileSchema.parse({
        interests: ["hiking"],
        budgetRange: { min: 0, max: 100 },
        homeLocation: null,
      });
      expect(result.interests).toHaveLength(1);
    });

    it("rejects empty interests", () => {
      expect(() =>
        profileSchema.parse({
          interests: [],
          budgetRange: { min: 0, max: 100 },
          homeLocation: null,
        }),
      ).toThrow();
    });

    it("rejects more than 50 interests", () => {
      const tooMany = Array.from({ length: 51 }, (_, i) => `interest-${i}`);
      expect(() =>
        profileSchema.parse({
          interests: tooMany,
          budgetRange: { min: 0, max: 100 },
          homeLocation: null,
        }),
      ).toThrow();
    });

    it("rejects budget values over 10000", () => {
      expect(() =>
        budgetRangeSchema.parse({ min: 0, max: 20000 }),
      ).toThrow();
    });
  });

  describe("filterSchema", () => {
    it("accepts partial filters", () => {
      const result = filterSchema.parse({ moods: ["romantic"] });
      expect(result.moods).toEqual(["romantic"]);
    });

    it("accepts empty filter", () => {
      const result = filterSchema.parse({});
      expect(result).toBeDefined();
    });

    it("rejects more than 5 moods", () => {
      expect(() =>
        filterSchema.parse({
          moods: ["romantic", "adventurous", "low-key", "foodie", "active", "romantic"],
        }),
      ).toThrow();
    });

    it("rejects budget values over 10000", () => {
      expect(() => filterSchema.parse({ budgetMax: 50000 })).toThrow();
    });
  });
});
