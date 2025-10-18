export const UNISWAP_V2_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

export const FACTORY_ABI = [
    {
        constant: true,
        inputs: [
            { name: 'tokenA', type: 'address' },
            { name: 'tokenB', type: 'address' },
        ],
        name: 'getPair',
        outputs: [{ name: 'pair', type: 'address' }],
        type: 'function',
    },
];

export const PAIR_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'getReserves',
        outputs: [{ name: 'reserve0', type: 'uint112' }, { name: 'reserve1', type: 'uint112' }, { name: 'blockTimestampLast', type: 'uint32' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'token0',
        outputs: [{ name: '', type: 'address' }],
        type: 'function',
    },
];