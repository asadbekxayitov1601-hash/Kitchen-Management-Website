import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { MarketUpdate } from '../types/kitchen';

interface NewsTickerProps {
  updates: MarketUpdate[];
}

export function NewsTicker({ updates }: NewsTickerProps) {
  const duplicatedUpdates = [...updates, ...updates, ...updates];

  return (
    <div className="bg-gradient-to-r from-accent/20 to-secondary/20 border-b border-accent/30 overflow-hidden">
      <div className="flex items-center gap-3 h-12">
        <div className="flex items-center gap-2 px-4 bg-accent/40 h-full shrink-0">
          <TrendingUp className="w-4 h-4 text-accent-foreground" />
          <span className="text-sm text-accent-foreground">Market Updates</span>
        </div>
        <motion.div
          className="flex gap-8 items-center whitespace-nowrap"
          animate={{
            x: [0, -1000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {duplicatedUpdates.map((update, index) => (
            <div key={`${update.id}-${index}`} className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{update.message}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
