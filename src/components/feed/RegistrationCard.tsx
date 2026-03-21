'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

type ProgramType =
  | 'private_training'
  | 'rep_team'
  | 'house_league'
  | 'tournament'
  | 'camp'
  | 'clinic'
  | 'tryout';

interface Program {
  name: string;
  type: ProgramType;
  description?: string;
  max_participants?: number;
  current_participants?: number;
  price: number;
  start_date?: string;
}

interface RegistrationCardProps {
  program: Program;
}

const TYPE_EMOJIS: Record<ProgramType, string> = {
  private_training: '\uD83C\uDFAF',
  rep_team: '\u2B50',
  house_league: '\uD83C\uDFDF\uFE0F',
  tournament: '\uD83C\uDFC6',
  camp: '\u26FA',
  clinic: '\uD83D\uDCDA',
  tryout: '\uD83D\uDD25',
};

export function RegistrationCard({ program }: RegistrationCardProps) {
  const spotsLeft =
    (program.max_participants || 0) - (program.current_participants || 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-[#D0FF00]/20 to-yellow-500/20 border-[#D0FF00]/30 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#D0FF00_1px,_transparent_1px)] bg-[length:24px_24px]" />
        </div>

        <div className="relative p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D0FF00] text-[#0A0A0A] text-xs font-bold mb-4">
            <span className="animate-pulse">&#9679;</span>
            REGISTRATION OPEN
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">
              {TYPE_EMOJIS[program.type] || '\uD83D\uDCCB'}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {program.name}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {program.description ||
                  'Join our program and take your game to the next level!'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <Users className="w-5 h-5 text-[#D0FF00] mx-auto mb-1" />
              <p className="text-xs text-gray-400 mb-1">Spots Left</p>
              <p className="text-lg font-bold text-white">
                {program.max_participants ? spotsLeft : '\u221E'}
              </p>
            </div>
            {program.price > 0 && (
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <DollarSign className="w-5 h-5 text-[#D0FF00] mx-auto mb-1" />
                <p className="text-xs text-gray-400 mb-1">Price</p>
                <p className="text-lg font-bold text-white">
                  ${program.price}
                </p>
              </div>
            )}
            {program.start_date && (
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <Calendar className="w-5 h-5 text-[#D0FF00] mx-auto mb-1" />
                <p className="text-xs text-gray-400 mb-1">Starts</p>
                <p className="text-sm font-bold text-white">
                  {new Date(program.start_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          <Button className="w-full bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90 font-bold group">
            Register Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
