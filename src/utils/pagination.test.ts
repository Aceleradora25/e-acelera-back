process.env.STACKBY_BASE_URL = "http://fakeurl";

import { pagination } from "./pagination";

describe("Pagination Util", () => {
    
    describe("pagination logic", () => {
        
        it("deve calcular corretamente os valores de skip e take para a página 1", () => {
            const result = pagination(1, 10);
            
            expect(result).toEqual({
                skip: 0,
                take: 10
            });
        });

        it("deve calcular corretamente o skip para a página 2", () => {
            const result = pagination(2, 10);
            
            expect(result.skip).toBe(10);
            expect(result.take).toBe(10);
        });

        it("deve forçar o limite para 10 se for enviado um valor não permitido", () => {
            const result = pagination(1, 30);
            
            expect(result.take).toBe(10);
        });

        it("deve aceitar limites permitidos como 25 e 50", () => {
            const result25 = pagination(1, 25);
            const result50 = pagination(1, 50);
            
            expect(result25.take).toBe(25);
            expect(result50.take).toBe(50);
        });

        it("deve calcular o skip corretamente com limite de 25 na página 3", () => {
            const result = pagination(3, 25);
            
            expect(result.skip).toBe(50);
            expect(result.take).toBe(25);
        });
    });
});