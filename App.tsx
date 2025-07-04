
import React, { useState, useCallback, useEffect } from 'react';
import { TopicList } from './components/TopicList';
import { LessonView } from './components/LessonView';
import { GraderView } from './components/GraderView';
import { PYTHON_TOPICS } from './constants';
import { generateLesson, generateAssignment, gradeSubmission } from './services/geminiService';
import type { Lesson, Feedback } from './types';
import { PythonIcon } from './components/icons/PythonIcon';
import { LoadingSpinner } from './components/icons/LoadingSpinner';

const App: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<string>(PYTHON_TOPICS[0]);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [assignment, setAssignment] = useState<string | null>(null);
    const [studentCode, setStudentCode] = useState<string>('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);
    const [isLoadingAssignment, setIsLoadingAssignment] = useState<boolean>(false);
    const [isLoadingGrade, setIsLoadingGrade] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchLesson = useCallback(async (topic: string) => {
        setIsLoadingLesson(true);
        setError(null);
        setLesson(null);
        setAssignment(null);
        setFeedback(null);
        setStudentCode('');

        try {
            const lessonData = await generateLesson(topic);
            setLesson(lessonData);
        } catch (err) {
            setError('Không thể tải nội dung bài học. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsLoadingLesson(false);
        }
    }, []);

    useEffect(() => {
        if (selectedTopic) {
            handleFetchLesson(selectedTopic);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTopic]);

    const handleGenerateAssignment = async () => {
        if (!selectedTopic) return;
        setIsLoadingAssignment(true);
        setError(null);
        setAssignment(null);
        try {
            const assignmentText = await generateAssignment(selectedTopic);
            setAssignment(assignmentText);
            setStudentCode(`# Dán code của bạn vào đây để giải quyết bài toán:\n# ${assignmentText}\n\n`);
        } catch (err) {
            setError('Không thể tạo bài tập. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsLoadingAssignment(false);
        }
    };

    const handleGradeSubmission = async () => {
        if (!assignment || !studentCode) return;
        setIsLoadingGrade(true);
        setError(null);
        setFeedback(null);
        try {
            const gradeData = await gradeSubmission(assignment, studentCode);
            setFeedback(gradeData);
        } catch (err) {
            setError('Không thể chấm bài. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsLoadingGrade(false);
        }
    };
    
    const handleSelectTopic = (topic: string) => {
        setSelectedTopic(topic);
    };

    return (
        <div className="min-h-screen font-sans bg-dark">
            <header className="bg-dark-accent border-b border-gray-700 p-4 shadow-md">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <PythonIcon className="h-10 w-10 text-yellow-400" />
                        <h1 className="text-2xl font-bold text-light">Trợ Lý Giảng Dạy Python</h1>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto p-4 lg:p-6">
                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-4" role="alert">
                        <strong className="font-bold">Lỗi!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
                <div className="grid grid-cols-12 gap-6">
                    <aside className="col-span-12 lg:col-span-3">
                        <TopicList 
                            topics={PYTHON_TOPICS} 
                            selectedTopic={selectedTopic} 
                            onSelectTopic={handleSelectTopic} 
                        />
                    </aside>

                    <div className="col-span-12 lg:col-span-9 grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <section className="col-span-1 xl:col-span-1">
                            {isLoadingLesson ? (
                                <div className="flex justify-center items-center h-96 bg-dark-accent rounded-lg">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <LessonView
                                    topic={selectedTopic}
                                    lesson={lesson}
                                    assignment={assignment}
                                    onGenerateAssignment={handleGenerateAssignment}
                                    isLoadingAssignment={isLoadingAssignment}
                                />
                            )}
                        </section>
                        <section className="col-span-1 xl:col-span-1">
                            <GraderView 
                                studentCode={studentCode}
                                onCodeChange={setStudentCode}
                                onGrade={handleGradeSubmission}
                                feedback={feedback}
                                isLoading={isLoadingGrade}
                                assignmentAvailable={!!assignment}
                            />
                        </section>
                    </div>
                </div>
            </main>
            <footer className="text-center py-4 mt-6 border-t border-gray-700">
                <p className="text-dark-text-secondary text-sm">Cung cấp bởi Gemini API & React</p>
            </footer>
        </div>
    );
};

export default App;
