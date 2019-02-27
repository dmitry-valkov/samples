import { Winner, SquareValue } from "./Winner";

const winConX: Array<SquareValue> = ['X', 'X', 'X', null, null, null, null, null, null];
const winConO: Array<SquareValue> = ['O', null, null, null, 'O', null, null, null, 'O'];
const notWinCon: Array<SquareValue> = [null, null, null, null, null, null, null, null, null];

describe('Winner', () => {
    it('has .calculate static method', () => {
        expect(Winner.calculate).toBeDefined();
    });

    describe('.calculate method', () => {
        it('should return X when X has win condition', () => {
            const result = Winner.calculate(winConX);

            expect(result).toBe('X');
        });

        it('should return O when O has win condition', () => {
            const result = Winner.calculate(winConO);

            expect(result).toBe('O');
        });

        it(`should return Null when hasn't win condition`, () => {
            const result = Winner.calculate(notWinCon);

            expect(result).toBe(null);
        });
    });
});