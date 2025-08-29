"use client";
import PriceChart from "@/components/trading/PriceChart";


const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MarketView
            </h1>
            <p className="text-muted-foreground">Real-time trading dashboard</p>
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

            {/* asks and bid */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
