import Header from '@/components/layout/Header';
import Assets from '@/components/trading/Assets';
import PriceChart from '@/components/trading/PriceChart';
import TradingPanel from '@/components/trading/TradingPanel';
import Orders from '@/components/trading/UserOrders';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className=" mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
          <div className="lg:col-span-2 ">
            <Assets />
          </div>

          <div className="lg:col-span-3 ">
            <PriceChart />
          </div>

          <div className="lg:col-span-1 ">
            <TradingPanel />
          </div>
        </div>

        <div className="mt-6">
          <Orders />
        </div>
      </main>
    </div>
  );
};

export default Index;
