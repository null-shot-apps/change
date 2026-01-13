'use client';

import { useState } from 'react';
import { ArrowDownUp, Settings, Info, TrendingUp, Clock } from 'lucide-react';

const TOKENS = [
  { symbol: 'AVAX', name: 'Avalanche', balance: '12.5', price: 38.42, logo: '🔺' },
  { symbol: 'USDC', name: 'USD Coin', balance: '1,250.00', price: 1.00, logo: '💵' },
  { symbol: 'USDT', name: 'Tether', balance: '850.00', price: 1.00, logo: '💲' },
  { symbol: 'WETH', name: 'Wrapped Ether', balance: '0.5', price: 3245.12, logo: '💎' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.025', price: 65432.10, logo: '₿' },
  { symbol: 'JOE', name: 'Joe Token', balance: '500.00', price: 0.45, logo: '☕' },
];

export default function SwapPage() {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);
  const [showFromSelect, setShowFromSelect] = useState(false);
  const [showToSelect, setShowToSelect] = useState(false);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(Number(value))) {
      const rate = toToken.price / fromToken.price;
      const calculated = (Number(value) * rate * (1 - Number(slippage) / 100)).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount('');
    }
  };

  const priceImpact = fromAmount ? ((Number(fromAmount) * fromToken.price) / 1000000 * 100).toFixed(2) : '0.00';
  const gasFee = '0.002';
  const route = `${fromToken.symbol} → ${toToken.symbol}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Swap Tokens</h1>
          <p className="text-gray-600 dark:text-gray-400">Trade tokens instantly on Avalanche</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Swap Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              {/* Settings Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Swap</h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slippage Tolerance
                    </label>
                    <div className="flex gap-2">
                      {['0.1', '0.5', '1.0'].map((val) => (
                        <button
                          key={val}
                          onClick={() => setSlippage(val)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            slippage === val
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white"
                    placeholder="Custom slippage %"
                    step="0.1"
                  />
                </div>
              )}

              {/* From Token */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      placeholder="0.0"
                      className="text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white w-full"
                    />
                    <button
                      onClick={() => setShowFromSelect(!showFromSelect)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                    >
                      <span className="text-2xl">{fromToken.logo}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{fromToken.symbol}</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      ${(Number(fromAmount || 0) * fromToken.price).toFixed(2)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Balance: {fromToken.balance}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['25%', '50%', '75%', 'MAX'].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => {
                          const multiplier = percent === 'MAX' ? 1 : Number(percent.replace('%', '')) / 100;
                          handleFromAmountChange((Number(fromToken.balance.replace(',', '')) * multiplier).toString());
                        }}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        {percent}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Token Select Dropdown */}
                {showFromSelect && (
                  <div className="absolute z-10 mt-2 w-96 bg-white dark:bg-gray-700 rounded-xl shadow-2xl p-4 max-h-96 overflow-y-auto">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Select Token</h3>
                    {TOKENS.filter(t => t.symbol !== toToken.symbol).map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => {
                          setFromToken(token);
                          setShowFromSelect(false);
                          handleFromAmountChange(fromAmount);
                        }}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{token.logo}</span>
                          <div className="text-left">
                            <div className="font-bold text-gray-900 dark:text-white">{token.symbol}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">{token.balance}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">${token.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  onClick={handleSwapTokens}
                  className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg transition-all hover:scale-110"
                >
                  <ArrowDownUp className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* To Token */}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="number"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white w-full"
                    />
                    <button
                      onClick={() => setShowToSelect(!showToSelect)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                    >
                      <span className="text-2xl">{toToken.logo}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{toToken.symbol}</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      ${(Number(toAmount || 0) * toToken.price).toFixed(2)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Balance: {toToken.balance}
                    </span>
                  </div>
                </div>

                {/* Token Select Dropdown */}
                {showToSelect && (
                  <div className="absolute z-10 mt-2 w-96 bg-white dark:bg-gray-700 rounded-xl shadow-2xl p-4 max-h-96 overflow-y-auto">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Select Token</h3>
                    {TOKENS.filter(t => t.symbol !== fromToken.symbol).map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => {
                          setToToken(token);
                          setShowToSelect(false);
                          handleFromAmountChange(fromAmount);
                        }}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{token.logo}</span>
                          <div className="text-left">
                            <div className="font-bold text-gray-900 dark:text-white">{token.symbol}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">{token.balance}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">${token.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Details */}
              {fromAmount && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      1 {fromToken.symbol} = {(toToken.price / fromToken.price).toFixed(6)} {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Price Impact</span>
                    <span className={`font-medium ${Number(priceImpact) > 1 ? 'text-red-500' : 'text-green-500'}`}>
                      {priceImpact}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Slippage Tolerance</span>
                    <span className="font-medium text-gray-900 dark:text-white">{slippage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Gas Fee (est.)</span>
                    <span className="font-medium text-gray-900 dark:text-white">{gasFee} AVAX</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Route</span>
                    <span className="font-medium text-gray-900 dark:text-white">{route}</span>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <button
                disabled={!fromAmount || Number(fromAmount) <= 0}
                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all disabled:cursor-not-allowed text-lg"
              >
                {!fromAmount ? 'Enter Amount' : 'Swap Tokens'}
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Recent Swaps */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Swaps</h3>
              </div>
              <div className="space-y-3">
                {[
                  { from: 'AVAX', to: 'USDC', amount: '5.2', time: '2m ago' },
                  { from: 'USDT', to: 'WETH', amount: '1000', time: '5m ago' },
                  { from: 'JOE', to: 'AVAX', amount: '250', time: '8m ago' },
                ].map((swap, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ArrowDownUp className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {swap.from} → {swap.to}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{swap.amount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{swap.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Market Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">24h Volume</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">$12.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Liquidity</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">$45.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Pairs</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">156</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Swap Tips</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Set slippage based on market volatility</li>
                    <li>• Check price impact before swapping</li>
                    <li>• Gas fees are paid in AVAX</li>
                    <li>• Transactions are instant on Avalanche</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

