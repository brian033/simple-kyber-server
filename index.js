const getSwapParameters =
    require("@kyberswap/aggregator-sdk").default;
const express = require("express");
const app = express();
app.use(express.json());

const params = async () => {
    const swapParameters = await getSwapParameters({
        chainId: 56, // Binance Smart Chain Mainnet.
        currencyInAddress:
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        currencyInDecimals: 18,
        amountIn: "99920000000000000",
        currencyOutAddress:
            "0xfe56d5892BDffC7BF58f2E84BE1b2C32D21C308b", // KNC
        currencyOutDecimals: 18,
        tradeConfig: {
            // 32444091225021821257 = 32606311681146930364 / (1 + 0.5%)
            // 32606311681146930364 is the outputAmount which come from API response.
            // 0.5% is allowed slippage.
            minAmountOut: "32444091225021821257",
            recipient:
                "0x16368dD7e94f177B8C2c028Ef42289113D328121",
            deadline: 1641804722938, // = Date.now() + 20 * 60 * 1000
        },
        feeConfig: {
            isInBps: true,
            feeAmount: "8", // 0.08%
            feeReceiver:
                "0xDa0D8fF1bE1F78c5d349722A5800622EA31CD5dd",
            chargeFeeBy: "currency_in",
        },
        customTradeRoute: `[[{"pool":"0x6170b6d96167346896169b35e1e9585feab873bb","tokenIn":"0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c","tokenOut":"0xfe56d5892bdffc7bf58f2e84be1b2c32d21c308b","swapAmount":"99920000000000000","amountOut":"32606311681146930364","limitReturnAmount":"0","maxPrice":"115792089237316195423570985008687907853269984665640564039457584007913129639935","exchange":"kyberswap","poolLength":2,"poolType":"dmm"}]]`,
    });
    return swapParameters;
};
app.get("/", async (req, res) => {
    const swapParameters = await params();
    res.json(swapParameters);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
