import { sum } from "../src/sum";

test("Deve Somar dois números", () => {
    const result = sum(2, 3);
    expect(result).toBe(5);
});