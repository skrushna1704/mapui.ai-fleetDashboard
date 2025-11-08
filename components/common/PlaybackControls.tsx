'use client';

import { Play, Pause, RotateCcw, Gauge } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function PlaybackControls({
  isPlaying,
  playbackSpeed,
  progress,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  const speedOptions = [1, 5, 10, 20, 50];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors shadow-md"
          aria-label="Reset"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Speed:</span>
          <div className="flex gap-1">
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 min-w-[50px] text-right">
              {progress.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

