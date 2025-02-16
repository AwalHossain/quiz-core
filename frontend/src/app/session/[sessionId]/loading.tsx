import { Loader2 } from 'lucide-react';
import React from 'react';

const LoadingExamSession = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="w-16 h-16 animate-spin" />
      <p className="text-lg text-gray-600">পরীক্ষা লোড হচ্ছে...</p>
    </div>
  );
};

export default LoadingExamSession; 