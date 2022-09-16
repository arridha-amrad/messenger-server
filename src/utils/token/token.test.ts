import { it, expect, describe } from '@jest/globals';
import { createToken, TokenTypes, verifyToken } from './token';

describe('Creating and validating link or refresh token', () => {
    it('should match the input and output', async () => {
        const userId = '12';
        const types: TokenTypes = 'link';
        const token = await createToken(userId, types);
        const result = await verifyToken(token, types);
        expect(result.userId).toBe(userId);
        expect(result.type).toBe(types);
        expect(result.exp - result.iat).toEqual(24 * 60 * 60);
    });
});

// describe("Creating and validating auth token", async () => {
//     it("should ok", async() => {
//         const userId = "123";
//         const token = await createToken(userId, "auth")
//         const result = await verifyAuthToken()
//     })
// })
// it("should valid", async() => {
//     const token = await createToken("1", "link");
//     const data  = await verifyToken(token, "link")
//     console.log("data : ", data)
// })
