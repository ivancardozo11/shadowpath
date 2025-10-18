import { SwapResult } from './swap-result.entity';

describe('SwapResult Entity', () => {
  it('should create with correct values', () => {
    const swapResult = new SwapResult(
      '0xTokenA',
      '0xTokenB', 
      1000000000000000000n,
      2000000000n,
      '0xPair'
    );

    expect(swapResult.fromToken).toBe('0xTokenA');
    expect(swapResult.toToken).toBe('0xTokenB');
    expect(swapResult.amountIn).toBe(1000000000000000000n);
    expect(swapResult.amountOut).toBe(2000000000n);
    expect(swapResult.pairAddress).toBe('0xPair');
  });

  it('should convert to JSON correctly', () => {
    const swapResult = new SwapResult(
      '0xTokenA',
      '0xTokenB',
      1000000000000000000n,
      2000000000n,
      '0xPair'
    );

    const json = swapResult.toJSON();

    expect(json.fromToken).toBe('0xTokenA');
    expect(json.toToken).toBe('0xTokenB');
    expect(json.amountIn).toBe('1000000000000000000');
    expect(json.amountOut).toBe('2000000000');
    expect(json.pairAddress).toBe('0xPair');
  });
});