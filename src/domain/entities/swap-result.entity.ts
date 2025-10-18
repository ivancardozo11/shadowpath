export class SwapResult {
    constructor(
        public readonly fromToken: string,
        public readonly toToken: string,
        public readonly amountIn: bigint,
        public readonly amountOut: bigint,
        public readonly pairAddress: string,
    ){}
    toJSON(){
        return {
            fromToken: this.fromToken,
            toToken: this.toToken,
            amountIn: this.amountIn.toString(),
            amountOut: this.amountOut.toString(),
            pairAddress: this.pairAddress,
        }
    }
}