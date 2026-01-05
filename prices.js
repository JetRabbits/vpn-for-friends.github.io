// Pricing Configuration
const pricingConfig = {
    exchangeRates: {
        TRX_TO_USD: 0.013,
        USD_TO_RUB: 76
    },
    plans: [
        {
            id: '1_day',
            trxPrice: 13.0,
            discount: null
        },
        {
            id: '1_month',
            trxPrice: 130.0,
            discount: null
        },
        {
            id: '6_months',
            trxPrice: 585.0,
            discount: '-25%'
        },
        {
            id: '1_year',
            trxPrice: 780.0,
            discount: '-50%'
        }
    ]
};

// Conversion Logic
function calculatePrices(trxPrice) {
    const usdPrice = trxPrice * pricingConfig.exchangeRates.TRX_TO_USD;
    const rubPrice = usdPrice * pricingConfig.exchangeRates.USD_TO_RUB;

    return {
        trx: trxPrice,
        usd: Math.max(Math.round(usdPrice), 0.2),
        rub: Math.max(Math.round(rubPrice), 1)
    };
}
