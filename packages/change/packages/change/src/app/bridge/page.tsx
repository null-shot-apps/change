'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownUp, AlertCircle, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '⟠', color: 'text-blue-400' },
  { id: 'bnb', name: 'BNB Chain', symbol: 'BNB', icon: '◆', color: 'text-yellow-400' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬢', color: 'text-purple-400' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', icon: '▲', color: 'text-red-400' },
];

const BRIDGE_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠', balance: '2.5' },
  { symbol: 'USDC', name: 'USD Coin', icon: '💵', balance: '10,000' },
  { symbol: 'USDT', name: 'Tether', icon: '₮', balance: '5,000' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: '0.15' },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '◈', balance: '3,500' },
];

const BRIDGE_HISTORY = [
  { id: '1', from: 'Ethereum', to: 'Avalanche', token: 'USDC', amount: '1,000', status: 'completed', time: '2 hours ago', txHash: '0x1234...5678' },
  { id: '2', from: 'BNB Chain', to: 'Avalanche', token: 'ETH', amount: '0.5', status: 'confirming', time: '5 minutes ago', txHash: '0xabcd...efgh' },
  { id: '3', from: 'Polygon', to: 'Avalanche', token: 'USDT', amount: '500', status: 'pending', time: '1 minute ago', txHash: '0x9876...5432' },
];

export default function BridgePage() {
  const TREASURY_ADDRESS = '0xd657563170aae53d7bb866a95861dcee9fe6c089';
  const BRIDGE_FEE_PERCENT = 0.1; // 0.1% fee
  
  const [fromChain, setFromChain] = useState(CHAINS[0]);
  const [toChain, setToChain] = useState(CHAINS[3]);
  const [selectedToken, setSelectedToken] = useState(BRIDGE_TOKENS[0]);
  const [amount, setAmount] = useState('');
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [bridging, setBridging] = useState(false);

  const bridgeFee = amount ? (parseFloat(amount) * BRIDGE_FEE_PERCENT / 100).toFixed(4) : '0';
  const estimatedTime = '5-10 minutes';
  const receiveAmount = amount ? (parseFloat(amount) - parseFloat(bridgeFee)).toFixed(4) : '0';

  const handleSwapChains = () => {
    if (toChain.id !== 'avalanche') {
      const temp = fromChain;
      setFromChain(toChain);
      setToChain(temp);
    }
  };

  const handleBridge = () => {
    setBridging(true);
    setTimeout(() => {
      setBridging(false);
      setAmount('');
      alert('Bridge transaction initiated! Check the history below for status.');
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'confirming':
        return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cross-Chain Bridge
              </h1>
              <p className="text-sm text-gray-400 mt-1">Transfer assets across blockchains securely</p>
            </div>
            <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              Back to DEX
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-400 font-semibold mb-1">Important Security Notice</p>
                  <p className="text-gray-300">
                    Always verify the destination address. Bridge transactions are irreversible. 
                    Estimated time: {estimatedTime}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">From Chain</label>
                <div className="grid grid-cols-3 gap-3">
                  {CHAINS.filter(c => c.id !== 'avalanche').map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => setFromChain(chain)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        fromChain.id === chain.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                      }`}
                    >
                      <div className={`text-3xl mb-2 ${chain.color}`}>{chain.icon}</div>
                      <div className="text-sm font-semibold">{chain.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center my-4">
                <button
                  onClick={handleSwapChains}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-all hover:scale-110"
                >
                  <ArrowDownUp className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">To Chain</label>
                <div className="p-4 rounded-lg border-2 border-red-500 bg-red-500/10">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl text-red-400">▲</div>
                    <div>
                      <div className="font-semibold">Avalanche C-Chain</div>
                      <div className="text-sm text-gray-400">Fast & Low Cost</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Select Token</label>
                <div className="relative">
                  <button
                    onClick={() => setShowTokenSelect(!showTokenSelect)}
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedToken.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold">{selectedToken.symbol}</div>
                        <div className="text-sm text-gray-400">{selectedToken.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Balance</div>
                      <div className="font-semibold">{selectedToken.balance}</div>
                    </div>
                  </button>

                  {showTokenSelect && (
                    <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
                      {BRIDGE_TOKENS.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => {
                            setSelectedToken(token);
                            setShowTokenSelect(false);
                          }}
                          className="w-full p-3 hover:bg-gray-700 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{token.icon}</span>
                            <div className="text-left">
                              <div className="font-semibold">{token.symbol}</div>
                              <div className="text-xs text-gray-400">{token.name}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">{token.balance}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Amount to Bridge</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-xl"
                  />
                  <button
                    onClick={() => setAmount(selectedToken.balance.replace(',', ''))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bridge Fee (0.1%)</span>
                    <span className="font-semibold">{bridgeFee} {selectedToken.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Time</span>
                    <span className="font-semibold">{estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="font-semibold">~$2.50</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">You Will Receive</span>
                      <span className="font-bold text-lg text-green-400">{receiveAmount} {selectedToken.symbol}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBridge}
                disabled={!amount || parseFloat(amount) <= 0 || bridging}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:scale-100"
              >
                {bridging ? 'Bridging...' : 'Bridge Tokens'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Bridge Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Total Volume (24h)</div>
                  <div className="text-2xl font-bold text-green-400">$12.5M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Transactions</div>
                  <div className="text-2xl font-bold">8,432</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Avg. Bridge Time</div>
                  <div className="text-2xl font-bold">6 min</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Supported Chains</h3>
              <div className="space-y-3">
                {CHAINS.map((chain) => (
                  <div key={chain.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`text-xl ${chain.color}`}>{chain.icon}</span>
                      <span className="font-medium">{chain.name}</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bridge Transactions</h3>
          <div className="space-y-3">
            {BRIDGE_HISTORY.map((tx) => (
              <div key={tx.id} className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(tx.status)}
                    <div>
                      <div className="font-semibold">
                        {tx.amount} {tx.token}
                      </div>
                      <div className="text-sm text-gray-400">
                        {tx.from} → {tx.to}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm capitalize text-gray-400">{tx.status}</div>
                    <div className="text-xs text-gray-500">{tx.time}</div>
                  </div>
                  <a
                    href={`https://snowtrace.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


