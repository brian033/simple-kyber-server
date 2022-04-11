const getSwapParameters =
    require("@kyberswap/aggregator-sdk").default;
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const handleApiResponse = async ({
    data,
    chainId,
    tokenIn,
    tokenOut,
    recipient,
    slipperage,
    deadline,
}) => {
    const { tokens, inputAmount, swaps } = data;
    const minOut = Math.floor(
        swaps[0][0].amountOut /
            (1 + Number(slipperage) * 0.01)
    );
    const swapParameters = await getSwapParameters({
        chainId: chainId,
        currencyInAddress: tokenIn,
        currencyInDecimals: tokens[tokenIn].decimals,
        amountIn: inputAmount,
        currencyOutAddress: tokenOut,
        currencyOutDecimals: tokens[tokenOut].decimals,
        tradeConfig: {
            minAmountOut: minOut,
            recipient: recipient,
            deadline: deadline, // = Date.now() + 20 * 60 * 1000
        },
        feeConfig: {
            isInBps: true,
            feeAmount: "8", // 0.08%
            feeReceiver:
                "0xDa0D8fF1bE1F78c5d349722A5800622EA31CD5dd",
            chargeFeeBy: "currency_in",
        },
        customTradeRoute: JSON.stringify(swaps),
    });
    return swapParameters;
};
app.get("/api", async (req, res) => {
    const {
        chain,
        chainId,
        tokenIn,
        tokenOut,
        amountIn,
        recipient,
        slipperage,
        deadline,
    } = req.query;
    // console.log({ chain, tokenIn, chainId, tokenOut, amountIn });
    const params = {
        tokenIn,
        tokenOut,
        amountIn,
    };
    // console.log(params);
    const response = await axios.get(
        `https://aggregator-api.kyberswap.com/${chain}/route`,
        { params }
    );
    // console.log(response.data);
    const callData = await handleApiResponse({
        data: response.data,
        chainId,
        tokenIn,
        tokenOut,
        recipient,
        slipperage,
        deadline,
    });
    res.send(callData);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
