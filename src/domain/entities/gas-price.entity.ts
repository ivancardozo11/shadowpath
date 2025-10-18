export class GasPrice {
    constructor(
        public readonly wei: bigint,
        public readonly gwei: number,
        public readonly timestamp: Date,
    ){}
    static fromWei(weiValue: bigint): GasPrice {
        const gwei = Number(weiValue) / 1e9;
        return new GasPrice(weiValue, gwei, new Date());
      }
      toJSON(){
        return {
            wei: this.wei.toString(),
            gwei: this.gwei.toFixed(2),
            timestamp: this.timestamp.toISOString(),
        }
      }
}