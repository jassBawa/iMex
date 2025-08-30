"use client";
import LiveTrades from "@/components/trading/AsksBids";
import PriceChart from "@/components/trading/PriceChart";


const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-100/40 to-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-100/20 to-blue-200/20 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              MarketView Pro
            </h1>
            <p className="text-slate-600 font-medium">Professional Trading Dashboard</p>
          </div>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <PriceChart />
          </div>

          {/* Order Book */}
          <div className="lg:col-span-1">
          <LiveTrades />
            {/* asks and bid */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
