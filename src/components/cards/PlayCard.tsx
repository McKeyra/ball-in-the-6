'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Zap, Share2, MoreHorizontal, TrendingUp, Trophy, Flag, EyeOff, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlayPost } from '@/types';

export const PlayCard: React.FC<{ post: PlayPost }> = ({ post }) => {
  const [score, setScore] = useState(post.score);
  const [assists, setAssists] = useState(post.assists);
  const [userSelection, setUserSelection] = useState<number | null>(null);
  const [hasAssisted, setHasAssisted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (showMenu) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX / rect.width - 0.5 - rect.left / rect.width);
    y.set(e.clientY / rect.height - 0.5 - rect.top / rect.height);
  };

  const handleMouseLeave = (): void => {
    x.set(0);
    y.set(0);
    setShowMenu(false);
  };

  const showToast = (message: string): void => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerConfetti = (): void => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleScore = (points: number): void => {
    if (userSelection === points) {
      setScore(prev => prev - points);
      setUserSelection(null);
      return;
    }
    if (userSelection !== null) {
      setScore(prev => prev - userSelection + points);
    } else {
      setScore(prev => prev + points);
    }
    setUserSelection(points);
    triggerConfetti();
  };

  const handleAssist = (): void => {
    if (hasAssisted) {
      setAssists(prev => prev - 1);
      setHasAssisted(false);
      showToast("Assist removed");
    } else {
      setAssists(prev => prev + 1);
      setHasAssisted(true);
      triggerConfetti();
      showToast("You assisted this play!");
    }
  };

  const CONFETTI_COLORS = ['#c8ff00', '#a855f7', '#10b981'];

  return (
    <div className="perspective-1000 w-full flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{ rotateX: showMenu ? "0deg" : rotateX, rotateY: showMenu ? "0deg" : rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-sm rounded-[32px] bg-elevated border border-neutral-200 shadow-xl overflow-visible cursor-default group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-50 rounded-[32px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime/[0.12] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/[0.12] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <motion.div style={{ transform: "translateZ(30px)" }} className="relative z-30 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-neutral-700 ring-2 ring-transparent group-hover:ring-lime/50 transition-all">
                <img src={post.author.avatarUrl || ''} alt={post.author.username} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-lime w-3 h-3 rounded-full border-2 border-elevated shadow-[0_0_10px_rgba(200,255,0,0.8)]" />
            </div>
            <div>
              <h3 className="text-neutral-900 font-bold text-sm tracking-wide drop-shadow-md hover:text-lime-dark transition-colors truncate max-w-[120px]">{post.author.username}</h3>
              <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-wider">@{post.author.handle}</p>
            </div>
          </div>
          <div className="relative z-50">
            <motion.button whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className={cn('text-neutral-600 hover:text-neutral-900 transition-all p-2 rounded-full backdrop-blur-md border border-neutral-100', showMenu ? 'bg-neutral-200 text-neutral-900' : 'bg-neutral-100 hover:border-neutral-300')}>
              <MoreHorizontal size={20} />
            </motion.button>
            <AnimatePresence>
              {showMenu && (
                <motion.div initial={{ opacity: 0, scale: 0.8, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -10 }} className="absolute right-0 top-full mt-2 w-48 bg-elevated/90 backdrop-blur-xl border border-neutral-200 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right" onClick={(e) => e.stopPropagation()}>
                  <div className="p-1 space-y-0.5">
                    <button onClick={() => showToast("Link Copied!")} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"><LinkIcon size={14} /><span>Copy Link</span></button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"><EyeOff size={14} /><span>Not Interested</span></button>
                    <div className="h-px bg-neutral-100 my-1" />
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"><Flag size={14} /><span>Report</span></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div style={{ transform: "translateZ(10px)" }} className="relative z-10 px-3 cursor-pointer">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
            <img src={post.imageUrl || ''} alt="Post content" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md border border-neutral-200 px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-lg">
              <TrendingUp size={14} className="text-lime-dark" />
              <span className="text-[10px] font-bold text-neutral-900 tracking-widest uppercase">Live Moment</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-neutral-900 text-lg font-medium leading-relaxed drop-shadow-lg line-clamp-3">&quot;{post.caption}&quot;</p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div style={{ transform: "translateZ(30px)" }} className="relative z-20 p-5 space-y-5">
          <div className="flex items-center justify-between gap-2">
            {[1, 2, 3].map((points) => (
              <motion.button key={points} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleScore(points); }} className={cn('relative flex-1 py-3 rounded-xl font-black text-sm transition-all duration-300 flex flex-col items-center justify-center space-y-1 shadow-lg border border-transparent cursor-pointer', userSelection === points ? points === 3 ? 'bg-gradient-to-br from-lime/80 to-emerald-500 border-lime/50 shadow-lime/30 text-black' : points === 2 ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-400/50 shadow-blue-500/40 text-white' : 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-400/50 shadow-emerald-500/40 text-white' : 'bg-neutral-100 hover:bg-neutral-200/50 text-neutral-600 hover:text-neutral-900 border-neutral-100')}>
                <div className="flex items-center space-x-1">
                  <Zap size={14} className={userSelection === points ? 'fill-current animate-pulse' : ''} />
                  <span className="text-base font-bold">+{points}</span>
                </div>
                <div className="text-[9px] uppercase opacity-70 tracking-widest font-mono">{points === 3 ? 'LEGENDARY' : points === 2 ? 'IMPRESSIVE' : 'SOLID'}</div>
              </motion.button>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-neutral-100 pt-5 gap-6">
            <div className="flex flex-col flex-1">
              <span className="text-neutral-500 text-[9px] font-mono uppercase tracking-widest mb-1.5 whitespace-nowrap">Impact Score</span>
              <div className="flex items-center space-x-2">
                <Trophy size={14} className="text-yellow-500 flex-shrink-0" />
                <AnimatePresence mode="popLayout">
                  <motion.span key={score} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -15, opacity: 0 }} className="text-2xl font-black text-neutral-900 leading-none tracking-tight">{score.toLocaleString()}</motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-end">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleAssist(); }} className={cn('group flex items-center justify-between w-full max-w-[140px] px-4 py-3 rounded-2xl border transition-all duration-300 shadow-lg backdrop-blur-md cursor-pointer', hasAssisted ? 'bg-lime/20 border-lime/50 text-lime-dark shadow-lime/20' : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 hover:text-neutral-900')}>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-70">Assist</span>
                  <span className="text-sm font-mono font-bold">{assists.toLocaleString()}</span>
                </div>
                <Share2 size={16} className={`transition-transform duration-500 ${hasAssisted ? 'rotate-180' : 'group-hover:rotate-12'}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Confetti */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div key={i} initial={{ x: "50%", y: "50%", scale: 0, opacity: 1 }} animate={{ x: `${50 + (Math.random() - 0.5) * 150}%`, y: `${50 + (Math.random() - 0.5) * 150}%`, scale: Math.random() * 1.5, opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute w-2 h-2 rounded-full" style={{ backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * 3)] }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-neutral-200 text-neutral-900 text-sm font-medium px-4 py-2 rounded-full shadow-2xl z-50 whitespace-nowrap">{toastMessage}</motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
