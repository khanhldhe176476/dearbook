import { motion } from 'motion/react';

interface LoadingProgressProps {
  loaded: number;
  total: number;
  message?: string;
}

export function LoadingProgress({ loaded, total, message }: LoadingProgressProps) {
  const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        {/* Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full opacity-20 blur-xl"
          />
          <div className="relative bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl w-full h-full flex items-center justify-center shadow-xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          ang ti ni dung 3D
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {message || 'Vui lng ch trong giy lt...'}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Tin 
            </span>
            <span className="text-sm font-bold text-rose-600">
              {percentage}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-rose-500 to-purple-600 rounded-full"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span> ti:</span>
          <span className="font-semibold text-gray-700">
            {loaded} / {total} trang
          </span>
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-rose-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
