import React, { useEffect, useState } from 'react';
import { 
  ScanEye, 
  Mic, 
  BookOpen, 
  Activity, 
  BrainCircuit, 
  Heart,
  Moon,
  Thermometer,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ViewState } from '../../types';
import { fetchHealthStats } from '../../services/backendService';

// Initial data points
const generateInitialData = () => {
  const data = [];
  for (let i = 0; i < 40; i++) {
    data.push({ name: i, value: 60 + Math.random() * 40 });
  }
  return data;
};

interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  unit?: string;
  status?: 'normal' | 'attention' | 'critical';
  onClick?: () => void;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, unit, status = 'normal', onClick, index }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white dark:bg-black p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group flex flex-col justify-between h-32
      hover:bg-black dark:hover:bg-white 
      hover:text-white dark:hover:text-black
      hover:border-black dark:hover:border-white
    `}
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
         <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-white dark:group-hover:text-black transition-colors" />
         <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors">{label}</span>
      </div>
      <div className={`w-2 h-2 rounded-full ${status === 'normal' ? 'bg-emerald-500' : status === 'attention' ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`}></div>
    </div>
    
    <div className="flex items-baseline space-x-1">
      <span className="text-3xl font-mono font-medium text-black dark:text-white group-hover:text-white dark:group-hover:text-black tracking-tight group-hover:scale-105 transition-all origin-left">{value}</span>
      {unit && <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-400 dark:group-hover:text-zinc-600">{unit}</span>}
    </div>

    <div className="flex items-center text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
      <span className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded group-hover:bg-zinc-800 dark:group-hover:bg-zinc-200 transition-colors">Range: Normal</span>
    </div>
  </div>
);

interface DashboardViewProps {
  onViewChange: (view: ViewState) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onViewChange }) => {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState(generateInitialData());

  useEffect(() => {
    fetchHealthStats('current_user').then(setStats);
  }, []);

  // Live ECG Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData];
        newData.shift(); // Remove first
        // Add new random point (Simulating a heartbeat spike occasionally)
        const isBeat = Math.random() > 0.9;
        const base = 70;
        const noise = Math.random() * 10;
        const spike = isBeat ? 40 : 0;
        
        newData.push({ 
          name: Date.now(), 
          value: base + noise + spike
        });
        return newData;
      });
    }, 100); // Update every 100ms for smooth look

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <header className="mb-6 flex items-center justify-between bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-10 bg-black dark:bg-white rounded-full"></div>
          <div>
            <h1 className="text-lg font-bold text-black dark:text-white uppercase tracking-wide transition-colors">Patient Monitor</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono transition-colors">ID: #8492-AX • Ambulatory</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 animate-pulse-slow transition-colors">
          <Activity className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
          <span>LIVE TELEMETRY</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Monitor Screen */}
        <div className="bg-white dark:bg-black rounded-xl lg:col-span-2 text-black dark:text-white relative overflow-hidden shadow-2xl border-4 border-zinc-100 dark:border-zinc-800 p-6 flex flex-col justify-between min-h-[300px] monitor-screen">
          
          {/* Moving Scan Line */}
          <div className="scan-line"></div>
          
          {/* Header */}
          <div className="relative z-10 flex justify-between items-start mb-4">
             <div>
                <span className="text-zinc-500 dark:text-zinc-500 font-mono text-xs">ECG LEAD II</span>
                <div className="flex items-baseline mt-1">
                   <span className="text-6xl font-mono font-bold tracking-tighter w-24">{chartData[chartData.length - 1]?.value.toFixed(0)}</span>
                   <span className="ml-2 text-sm text-zinc-500 font-mono">BPM</span>
                </div>
             </div>
             <div className="text-right">
                <span className="text-emerald-600 dark:text-emerald-500 font-mono text-xs">SPO2</span>
                <div className="flex items-baseline mt-1 justify-end">
                   <span className="text-4xl font-mono text-emerald-600 dark:text-emerald-500 font-bold">{stats?.vitals?.oxygen || '98'}</span>
                   <span className="ml-2 text-sm text-zinc-500 font-mono">%</span>
                </div>
             </div>
          </div>

          {/* Chart */}
          <div className="relative z-10 flex-1 w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[40, 140]} /> 
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="currentColor" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorBpm)" 
                  isAnimationActive={false} // Disable internal animation for smoother real-time updates
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-4 flex justify-between items-end border-t border-zinc-100 dark:border-zinc-800 pt-4">
            <div className="flex space-x-8">
               <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">RESP</span>
                  <span className="text-xl font-mono">18</span>
               </div>
               <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold">TEMP</span>
                  <span className="text-xl font-mono">36.6</span>
               </div>
            </div>
            <div className="text-xs font-mono animate-pulse font-bold tracking-widest text-zinc-400 dark:text-zinc-600">
               SINUS RHYTHM
            </div>
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-black p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex-1 flex flex-col justify-center items-center text-center hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-300">
             <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-3 ring-4 ring-zinc-50 dark:ring-zinc-900/50 transition-colors">
               <Heart className="w-8 h-8 text-black dark:text-white animate-pulse-slow" />
             </div>
             <h3 className="font-bold text-black dark:text-white transition-colors">Health Index</h3>
             <div className="mt-2 flex items-baseline justify-center">
               <span className="text-5xl font-mono font-bold text-black dark:text-white transition-colors">{stats?.wellnessScore}</span>
               <span className="text-sm text-zinc-400 dark:text-zinc-500 ml-1">/100</span>
             </div>
             <div className="mt-3 px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wide transition-colors">
               Stable Condition
             </div>
          </div>

          <button 
             onClick={() => onViewChange(ViewState.VOICE_ANALYSIS)}
             className="bg-black dark:bg-white text-white dark:text-black p-5 rounded-xl shadow-lg hover:shadow-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-between group"
           >
             <div className="text-left">
               <span className="block text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1 font-bold">Action</span>
               <span className="font-bold text-lg">Start Consult</span>
             </div>
             <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center group-hover:bg-white group-hover:text-black dark:group-hover:bg-black dark:group-hover:text-white transition-all duration-300 shadow-inner">
                <Mic className="w-6 h-6" />
             </div>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <StatCard 
           icon={Activity} 
           label="Blood Pressure" 
           value={stats?.vitals?.bloodPressure || '--'} 
           unit="mmHg" 
           index={0}
         />
         <StatCard 
           icon={Moon} 
           label="Sleep Cycle" 
           value={stats?.vitals?.sleep ? stats.vitals.sleep.split('h')[0] : '--'} 
           unit="HOURS" 
           index={1}
         />
         <StatCard 
           icon={Thermometer} 
           label="Weight" 
           value={stats?.vitals?.weight ? stats.vitals.weight.split(' ')[0] : '--'} 
           unit="KG" 
           index={2}
         />
         <StatCard 
           icon={ClipboardList} 
           label="Medication" 
           value="100" 
           unit="%" 
           index={3}
         />
      </div>

      <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-8 mb-4 px-1 transition-colors">Diagnostics & Triage</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ScanEye, label: "Imaging Analysis", sub: "Derm & X-Ray", view: ViewState.IMAGE_ANALYSIS },
          { icon: Mic, label: "Voice Biomarkers", sub: "Vocal Analysis", view: ViewState.VOICE_ANALYSIS },
          { icon: BrainCircuit, label: "Symptom Checker", sub: "AI Triage", view: ViewState.TEXT_ANALYSIS },
          { icon: BookOpen, label: "Medical Library", sub: "Protocols", view: ViewState.EDUCATION },
        ].map((item, idx) => (
          <div 
            key={idx}
            onClick={() => onViewChange(item.view)}
            className="
              bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800
              hover:bg-black dark:hover:bg-white
              hover:text-white dark:hover:text-black
              hover:border-black dark:hover:border-white
              cursor-pointer transition-all duration-300
              group flex items-center space-x-4
              text-black dark:text-white
              relative overflow-hidden
            "
          >
            <div className="
              relative z-10 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm border
              bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800
              text-black dark:text-white 
              group-hover:bg-transparent group-hover:border-transparent
            ">
               <item.icon className="w-6 h-6" />
            </div>
            <div className="relative z-10">
               <h3 className="font-bold text-inherit transition-colors">{item.label}</h3>
               <p className="text-xs transition-colors
                 text-zinc-500 dark:text-zinc-400 
                 group-hover:text-zinc-300 dark:group-hover:text-zinc-600
               ">{item.sub}</p>
            </div>
            <ArrowRight className="relative z-10 w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all duration-300
              text-zinc-400 dark:text-zinc-500
              group-hover:opacity-100 group-hover:translate-x-0 
              group-hover:text-white dark:group-hover:text-black 
            " />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;