process.env.STACKBY_BASE_URL = "http://fakeurl";

import { pagination } from "./pagination";

describe("Pagination Util", () => {

	describe("pagination logic", () => {

		it("deve calcular corretamente skip e take para a página 1", () => {
			const result = pagination(1, 10);

			expect(result).toEqual({
				skip: 0,
				take: 10,
			});
		});

		it("deve calcular corretamente o skip para a página 2", () => {
			const result = pagination(2, 10);

			expect(result.skip).toBe(10);
			expect(result.take).toBe(10);
		});

		it("deve calcular corretamente o skip para a página 3", () => {
			const result = pagination(3, 10);

			expect(result.skip).toBe(20);
			expect(result.take).toBe(10);
		});

		it("deve forçar limite 10 se for enviado valor não permitido", () => {
			const result = pagination(1, 30); 

			expect(result.take).toBe(10);
			expect(result.skip).toBe(0);
		});

		it("deve aceitar limites permitidos (25)", () => {
			const result = pagination(1, 25);

			expect(result.take).toBe(25);
			expect(result.skip).toBe(0);
		});

		it("deve aceitar limites permitidos (50)", () => {
			const result = pagination(1, 50);

			expect(result.take).toBe(50);
			expect(result.skip).toBe(0);
		});

		it("deve calcular skip corretamente com limite 25 na página 3", () => {
			const result = pagination(3, 25);

			expect(result.skip).toBe(50);
			expect(result.take).toBe(25);
		});

		it("deve sempre retornar apenas { skip, take }", () => {
			const result = pagination(1, 10);

			expect(Object.keys(result)).toEqual(["skip", "take"]);
		});

	});

});