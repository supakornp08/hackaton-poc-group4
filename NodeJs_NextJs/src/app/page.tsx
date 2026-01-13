'use client';

import { useState, useEffect } from 'react';
import { CurrencyPair, QuickService } from '@/types';

const quickServices: QuickService[] = [
  { icon: '💳', title: 'สินเชื่อส่งออก', desc: 'สนับสนุนการส่งออก' },
  { icon: '🏭', title: 'สินเชื่อนำเข้า', desc: 'สนับสนุนการนำเข้า' },
  { icon: '🌐', title: 'โอนเงินต่างประเทศ', desc: 'บริการโอนเงินระหว่างประเทศ' },
  { icon: '📜', title: 'Letter of Credit', desc: 'L/C และ Trust Receipt' },
  { icon: '🛡️', title: 'ประกันการส่งออก', desc: 'คุ้มครองความเสี่ยง' },
  { icon: '📊', title: 'Forward Contract', desc: 'ป้องกันความเสี่ยงค่าเงิน' },
];

const currencyPairs: CurrencyPair[] = [
  { symbol: 'OANDA:USDTHB', name: 'USD/THB', flag: '🇺🇸' },
  { symbol: 'OANDA:EURTHB', name: 'EUR/THB', flag: '🇪🇺' },
  { symbol: 'OANDA:GBPTHB', name: 'GBP/THB', flag: '🇬🇧' },
  { symbol: 'ICE:JPYTHB', name: 'JPY/THB', flag: '🇯🇵' },
  { symbol: 'FX:EURUSD', name: 'EUR/USD', flag: '🇪🇺' },
  { symbol: 'FX:USDJPY', name: 'USD/JPY', flag: '🇺🇸' },
  { symbol: 'FX:GBPUSD', name: 'GBP/USD', flag: '🇬🇧' },
  { symbol: 'FX:AUDUSD', name: 'AUD/USD', flag: '🇦🇺' },
  { symbol: 'FX:USDCNY', name: 'USD/CNY', flag: '🇨🇳' },
  { symbol: 'TVC:GOLD', name: 'Gold (XAU)', flag: '🥇' },
  { symbol: 'TVC:SILVER', name: 'Silver (XAG)', flag: '🥈' },
  { symbol: 'TVC:USOIL', name: 'Crude Oil', flag: '🛢️' },
];

const forexCrossRatesUrl = 'https://s.tradingview.com/embed-widget/forex-cross-rates/?locale=en&width=100%25&height=100%25&currencies=EUR%2CUSD%2CJPY%2CGBP%2CCHF%2CAUD%2CCAD%2CNZD%2CCNY%2CTHB&isTransparent=false&colorTheme=light';

export default function DashboardPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('OANDA:USDTHB');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const buildChartUrl = (symbol: string) => {
    const encodedSymbol = encodeURIComponent(symbol);
    const studies = encodeURIComponent(JSON.stringify(['RSI@tv-basicstudies', 'MACD@tv-basicstudies']));
    return `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_main&symbol=${encodedSymbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=${studies}&theme=light&style=1&timezone=Asia%2FBangkok&withdateranges=1&showpopupbutton=1&locale=th`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏦 ยินดีต้อนรับสู่ EXIM BANK</h1>
            <p className="text-primary-100 text-lg">ระบบติดตามอัตราแลกเปลี่ยนและบริการธนาคาร</p>
            <p className="text-primary-200 mt-2">ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย</p>
          </div>
          <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-primary-200">⏰ เวลาปัจจุบัน</p>
            <p className="text-3xl font-mono font-bold">
              {mounted && currentTime ? currentTime.toLocaleTimeString('th-TH') : '--:--:--'}
            </p>
            <p className="text-sm text-primary-200 mt-1">
              {mounted && currentTime 
                ? currentTime.toLocaleDateString('th-TH', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'กำลังโหลด...'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Services */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">⚡ บริการด่วน</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickServices.map((service, index) => (
            <div
              key={index}
              className="card text-center cursor-pointer hover:bg-primary-50 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{service.title}</h3>
              <p className="text-xs text-gray-500">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exchange Rate Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800">📈 อัตราแลกเปลี่ยน</h2>
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                LIVE
              </span>
            </div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="input max-w-xs"
            >
              {currencyPairs.map((pair) => (
                <option key={pair.symbol} value={pair.symbol}>
                  {pair.flag} {pair.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={buildChartUrl(selectedCurrency)}
              className="w-full h-full border-0"
              title="TradingView Chart"
              allowFullScreen
            />
          </div>
        </div>

        {/* Currency List */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">💱 สกุลเงิน</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {currencyPairs.map((pair) => (
              <button
                key={pair.symbol}
                onClick={() => setSelectedCurrency(pair.symbol)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  selectedCurrency === pair.symbol
                    ? 'bg-primary-100 text-primary-800 shadow-md'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{pair.flag}</span>
                <span className="font-medium">{pair.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Market Overview & Forex Cross Rates */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 ภาพรวมตลาด</h2>
          <div className="h-[350px] rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src="https://s.tradingview.com/embed-widget/market-overview/?locale=th"
              className="w-full h-full border-0"
              title="Market Overview"
              allowFullScreen
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">💹 Forex Cross Rates</h2>
          <div className="h-[350px] rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={forexCrossRatesUrl}
              className="w-full h-full border-0"
              title="Forex Cross Rates"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Economic Calendar */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📅 ปฏิทินเศรษฐกิจ</h2>
        <div className="h-[400px] rounded-lg overflow-hidden bg-gray-100">
          <iframe
            src="https://s.tradingview.com/embed-widget/events/?locale=en"
            className="w-full h-full border-0"
            title="Economic Calendar"
            allowFullScreen
          />
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-gray-100 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">📞 ติดต่อเรา</h3>
            <p className="text-gray-600">Call Center: 0 2271 3700</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🕐 เวลาทำการ</h3>
            <p className="text-gray-600">จันทร์ - ศุกร์ 8:30 - 16:30 น.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">📍 สำนักงานใหญ่</h3>
            <p className="text-gray-600">1193 ถ.พหลโยธิน แขวงพญาไท</p>
          </div>
        </div>
      </section>
    </div>
  );
}
