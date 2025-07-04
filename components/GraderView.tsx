
import React from 'react';
import type { Feedback } from '../types';
import { CodeBlock } from './CodeBlock';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface GraderViewProps {
    studentCode: string;
    onCodeChange: (code: string) => void;
    onGrade: () => void;
    feedback: Feedback | null;
    isLoading: boolean;
    assignmentAvailable: boolean;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const getColor = (s: number) => {
        if (s >= 80) return 'text-green-400';
        if (s >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    className="text-gray-700"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                />
                <path
                    className={getColor(score)}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    strokeDasharray={`${score}, 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getColor(score)}`}>
                {score}
            </div>
        </div>
    );
};


export const GraderView: React.FC<GraderViewProps> = ({ studentCode, onCodeChange, onGrade, feedback, isLoading, assignmentAvailable }) => {
    return (
        <div className="bg-dark-accent rounded-lg shadow-lg p-6 h-full flex flex-col space-y-4">
            <h2 className="text-2xl font-bold text-light border-b border-gray-700 pb-3">Nộp Bài & Chấm Điểm</h2>
            
            <div className="flex-grow flex flex-col space-y-4">
                <label htmlFor="code-input" className="font-semibold text-primary">Code của bạn</label>
                <textarea
                    id="code-input"
                    value={studentCode}
                    onChange={(e) => onCodeChange(e.target.value)}
                    placeholder={!assignmentAvailable ? "Vui lòng tạo bài tập trước khi nộp bài." : "Nhập code của bạn tại đây..."}
                    disabled={!assignmentAvailable}
                    className="w-full flex-grow bg-code-bg text-dark-text p-4 rounded-md font-mono text-sm border border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    spellCheck="false"
                />
            </div>
            
            <button
                onClick={onGrade}
                disabled={isLoading || !studentCode || !assignmentAvailable}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? <LoadingSpinner /> : 'Chấm Bài'}
            </button>
            
            {feedback && (
                <div className="border-t border-gray-700 pt-4 space-y-4">
                    <h3 className="text-xl font-bold text-light">Kết quả</h3>
                    <div className="bg-gray-900 p-4 rounded-lg flex items-center space-x-6">
                        <ScoreCircle score={feedback.score} />
                        <div>
                            <h4 className="font-semibold text-lg text-primary">Nhận xét từ AI</h4>
                            <div className="prose prose-invert prose-sm text-dark-text-secondary mt-1" dangerouslySetInnerHTML={{ __html: feedback.comments.replace(/\n/g, '<br />') }} />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-primary mb-2">Code tham khảo</h4>
                        <CodeBlock code={feedback.correctedCode} />
                    </div>
                </div>
            )}
        </div>
    );
};
