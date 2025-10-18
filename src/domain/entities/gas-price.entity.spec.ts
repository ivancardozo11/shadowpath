import { GasPrice } from './gas-price.entity';

describe('GasPrice Entity', () => {
  it('should create from wei', () => {
    const gasPrice = GasPrice.fromWei(20000000000n);
    
    expect(gasPrice.wei).toBe(20000000000n);
    expect(gasPrice.gwei).toBe(20);
  });

  it('should convert to JSON', () => {
    const gasPrice = new GasPrice(15000000000n, 15, new Date('2025-01-01'));
    const json = gasPrice.toJSON();
    
    expect(json.wei).toBe('15000000000');
    expect(json.gwei).toBe('15.00');
  });
});