"use client";

import Link from "next/link";

type RightSidebarProps = {
    habits: { name: string; completed: boolean }[];
    currentStreak: number;
    longestStreak: number;
};

export function RightSidebar({ habits, currentStreak, longestStreak }: RightSidebarProps) {
    const hasHabits = habits.length > 0;
    const completedCount = habits.filter((h) => h.completed).length;
    const percentage = hasHabits ? Math.round((completedCount / habits.length) * 100) : 0;

    return (
        <aside className="hidden xl:flex w-[380px] flex-col gap-6 p-8 relative overflow-y-auto shrink-0">
            {/* Log New Habit Button */}
            <Link
                href="/tracker"
                className="w-full py-5 rounded-[10px] neon-gradient text-navy-deep font-extrabold text-lg neon-glow neon-glow-hover hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
                <span className="material-icons-round text-2xl group-hover:rotate-90 transition-transform">
                    add_circle
                </span>
                Log New Habit
            </Link>

            {/* Daily Goals */}
            <div className="glass-panel rounded-3xl p-7 border border-primary/20 shadow-lg">
                {hasHabits ? (
                    <>
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-0.5">Daily Goals</h3>
                                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                                    {completedCount}/{habits.length} completed today
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-primary drop-shadow-[0_0_10px_rgba(0,242,255,0.4)]">
                                    {percentage}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-8 relative">
                            <div
                                className="h-full neon-gradient neon-glow rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>

                        {/* Habit List */}
                        <div className="space-y-4">
                            {habits.map((habit, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${habit.completed
                                            ? "bg-primary/10 border border-primary/20 hover:bg-primary/20"
                                            : "glass-panel border border-white/5 hover:border-primary/30"
                                        }`}
                                >
                                    {habit.completed ? (
                                        <div className="w-7 h-7 rounded-lg neon-gradient flex items-center justify-center neon-glow">
                                            <span className="material-icons-round text-navy-deep text-lg">check</span>
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-lg border-2 border-slate-700 group-hover:border-primary/50 transition-colors" />
                                    )}
                                    <div className="flex-1">
                                        <span
                                            className={`text-sm font-bold ${habit.completed
                                                    ? "line-through opacity-50 text-white"
                                                    : "text-slate-300"
                                                }`}
                                        >
                                            {habit.name}
                                        </span>
                                    </div>
                                    {habit.completed ? (
                                        <span className="text-[10px] text-primary font-black uppercase tracking-tighter">
                                            Completed
                                        </span>
                                    ) : (
                                        <Link href="/tracker">
                                            <span className="material-icons-round text-slate-700 text-lg hover:text-primary transition-colors">
                                                chevron_right
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty state - no habits set up yet */
                    <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 neon-gradient flex items-center justify-center neon-glow">
                            <span className="material-icons-round text-navy-deep text-3xl">rocket_launch</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Start Your New Journey
                        </h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Now Be Consistent.<br />
                            Create your first habit to track your progress.
                        </p>
                        <Link
                            href="/tracker"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full neon-gradient text-navy-deep font-bold text-sm neon-glow hover:-translate-y-0.5 transition-all"
                        >
                            <span className="material-icons-round text-lg">add_circle</span>
                            Create First Habit
                        </Link>
                    </div>
                )}
            </div>

            {/* Streak Card */}
            <div className="glass-panel rounded-3xl p-7 border border-white/5 shadow-inner">
                <div className="flex items-center gap-3 mb-5">
                    <span className="material-icons-round text-primary text-xl">local_fire_department</span>
                    <h3 className="text-lg font-bold text-white">Daily Streak</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-panel rounded-2xl p-5 text-center border border-white/5">
                        <p className="text-3xl font-black text-primary drop-shadow-[0_0_10px_rgba(0,242,255,0.3)]">
                            {currentStreak}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Current</p>
                    </div>
                    <div className="glass-panel rounded-2xl p-5 text-center border border-white/5">
                        <p className="text-3xl font-black text-white">
                            {longestStreak}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Best</p>
                    </div>
                </div>
                {currentStreak === 0 && (
                    <p className="text-xs text-slate-500 text-center mt-4">
                        Complete a habit today to start your streak! 🔥
                    </p>
                )}
            </div>

            {/* Explore Challenges Link */}
            <Link
                href="/challenges"
                className="w-full py-3.5 rounded-2xl glass-panel text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 hover:border-primary/20 transition-all border border-white/5 text-center"
            >
                Discover Challenges
            </Link>
        </aside>
    );
}
