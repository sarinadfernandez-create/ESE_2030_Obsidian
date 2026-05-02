import { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrawerStore } from '../../store/drawerStore';
import { SolutionFrameRenderer } from '../visualizations/SolutionFrameRenderer';
import { MarkdownMath } from '../math/MarkdownMath';

function reducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AnimatedSolutionDrawer() {
  const isOpen = useDrawerStore((s) => s.isOpen);
  const problem = useDrawerStore((s) => s.problem);
  const vizComponent = useDrawerStore((s) => s.vizComponent);
  const currentFrameIndex = useDrawerStore((s) => s.currentFrameIndex);
  const isPlaying = useDrawerStore((s) => s.isPlaying);
  const tweenT = useDrawerStore((s) => s.tweenT);
  const close = useDrawerStore((s) => s.close);
  const play = useDrawerStore((s) => s.play);
  const pause = useDrawerStore((s) => s.pause);
  const setFrameIndex = useDrawerStore((s) => s.setFrameIndex);
  const setTweenT = useDrawerStore((s) => s.setTweenT);
  const prev = useDrawerStore((s) => s.prev);
  const next = useDrawerStore((s) => s.next);

  // Drawer only opens for open-format problems with animated solutions; narrow safely.
  const frames =
    problem && problem.format === 'open' ? problem.solutionFrames ?? [] : [];
  const frame = frames[currentFrameIndex];
  const prevFrame = currentFrameIndex > 0 ? frames[currentFrameIndex - 1] : null;

  const totalDuration = useMemo(
    () => frames.reduce((sum, f) => sum + (f.durationMs ?? 1500), 0),
    [frames]
  );
  const elapsedDuration = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < currentFrameIndex; i++) sum += frames[i]?.durationMs ?? 1500;
    sum += (frame?.durationMs ?? 0) * tweenT;
    return sum;
  }, [frames, currentFrameIndex, tweenT, frame]);

  const [reduce] = useState(reducedMotion);

  // RAF loop for playback
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying || !isOpen) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }
    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const state = useDrawerStore.getState();
      const liveFrames =
        state.problem && state.problem.format === 'open'
          ? state.problem.solutionFrames ?? []
          : [];
      const liveFrame = liveFrames[state.currentFrameIndex];
      if (!liveFrame) return;
      const dur = liveFrame.durationMs ?? 1500;
      const advance = (reduce ? dur * 0.99 : dt) / dur;
      const nextT = state.tweenT + advance;
      if (nextT >= 1) {
        const idx = state.currentFrameIndex;
        const total = liveFrames.length;
        if (idx >= total - 1) {
          useDrawerStore.getState().setTweenT(1);
          useDrawerStore.getState().pause();
          return;
        }
        useDrawerStore.getState().setFrameIndex(idx + 1);
        useDrawerStore.getState().setTweenT(0);
      } else {
        useDrawerStore.getState().setTweenT(nextT);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, isOpen, reduce]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isPlaying) pause();
        else play();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isPlaying, close, play, pause, prev, next]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'black',
              zIndex: 200,
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="glass"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: 'min(45vw, 100vw)',
              minWidth: 600,
              maxWidth: 900,
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--border-default)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <button
              onClick={close}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                padding: '14px 24px',
                textAlign: 'left',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              ◀ animated solution · drawer
            </button>

            {/* Problem statement */}
            {problem && (
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-tertiary)',
                    marginBottom: 6,
                  }}
                >
                  {problem.id}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  <MarkdownMath source={problem.statement} />
                </div>
              </div>
            )}

            {/* Viz area */}
            <div
              style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                background: 'var(--bg-base)',
              }}
            >
              {frame && vizComponent ? (
                <SolutionFrameRenderer
                  vizComponent={vizComponent}
                  frame={frame}
                  prevFrame={prevFrame}
                  t={tweenT}
                />
              ) : (
                <div
                  style={{
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                  }}
                >
                  Animated solution not yet available.
                </div>
              )}
            </div>

            {/* Caption */}
            {frame && (
              <div
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-panel)',
                  minHeight: 80,
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  lineHeight: 1.55,
                }}
              >
                <MarkdownMath source={frame.caption} />
              </div>
            )}

            {/* Scrubber */}
            <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border-subtle)' }}>
              <input
                type="range"
                min={0}
                max={frames.length - 1 + 0.999}
                step={0.001}
                value={currentFrameIndex + tweenT}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const idx = Math.floor(v);
                  pause();
                  setFrameIndex(idx);
                  setTweenT(v - idx);
                }}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
                  frame {currentFrameIndex + 1} / {frames.length}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="graph-control-btn" onClick={prev} disabled={currentFrameIndex === 0}>
                    ◀
                  </button>
                  <button
                    className="graph-control-btn"
                    onClick={() => (isPlaying ? pause() : play())}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button
                    className="graph-control-btn"
                    onClick={next}
                    disabled={currentFrameIndex === frames.length - 1}
                  >
                    ▶
                  </button>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
                  {formatTime(elapsedDuration)} / {formatTime(totalDuration)}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
