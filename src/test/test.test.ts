import { deepEqual } from "node:assert/strict";
import test from "node:test";

const add = (a: number, b: number) => a + b;

test("hello", () => {
  deepEqual(add(1, 2), 3);
});
