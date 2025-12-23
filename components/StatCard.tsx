
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'negative';
  icon: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendType, icon, iconColor }) => {
  const isTrendPositive = trendType === 'positive';

  return (
    <div className="bg-surface-dark border border-border-green rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group transition-all hover:border-primary/30">
      <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className={`material-symbols-outlined text-6xl ${iconColor}`}>{icon}</span>
      </div>
      <p className="text-text-muted text-sm font-medium">{title}</p>
      <p className="text-white text-3xl font-bold tracking-tight">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-bold w-fit px-2 py-1 rounded ${
        isTrendPositive ? 'text-primary bg-primary/10' : 'text-red-400 bg-red-400/10'
      }`}>
        <span className="material-symbols-outlined text-sm">
          {isTrendPositive ? 'trending_up' : 'trending_down'}
        </span>
        <span>{trend}</span>
      </div>
    </div>
  );
};

export default StatCard;
