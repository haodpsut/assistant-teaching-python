
import React from 'react';
import type { Lesson } from '../types';
import { CodeBlock } from './CodeBlock';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface LessonViewProps {
    topic: string;
    lesson: Lesson | null;
    assignment: string | null;
    onGenerateAssignment: () => void;
    isLoadingAssignment: boolean;
}

export const LessonView: React.FC<LessonViewProps> = ({ topic, lesson, assignment, onGenerateAssignment, isLoadingAssignment }) => {
    return (
        <div className="bg-dark-accent rounded-lg shadow-lg p-6 space-y-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-light border-b border-gray-700 pb-3">{topic}</h2>
            
            {lesson ? (
                <div className="flex-grow space-y-6 overflow-y-auto pr-2">
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Lý Thuyết</h3>
                        <p className="text-dark-text-secondary leading-relaxed">{lesson.theory}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Code Mẫu</h3>
                        <CodeBlock code={lesson.code} />
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-primary mb-2">Bài Tập Vận Dụng</h3>
                        {assignment ? (
                             <p className="text-dark-text-secondary bg-gray-900 p-4 rounded-md border border-gray-700">{assignment}</p>
                        ) : (
                            <div className="text-center p-4 bg-gray-900 rounded-md">
                                <p className="mb-4 text-dark-text-secondary">Nhận một bài tập để kiểm tra kiến thức của bạn.</p>
                                <button
                                    onClick={onGenerateAssignment}
                                    disabled={isLoadingAssignment}
                                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                                >
                                    {isLoadingAssignment ? <LoadingSpinner className="w-5 h-5" /> : 'Tạo Bài Tập'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                 <p className="text-dark-text-secondary">Chọn một chủ đề để bắt đầu.</p>
            )}
        </div>
    );
};
