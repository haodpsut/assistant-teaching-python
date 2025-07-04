
import React from 'react';

interface TopicListProps {
    topics: string[];
    selectedTopic: string;
    onSelectTopic: (topic: string) => void;
}

export const TopicList: React.FC<TopicListProps> = ({ topics, selectedTopic, onSelectTopic }) => {
    return (
        <div className="bg-dark-accent rounded-lg shadow-lg p-4 h-full">
            <h2 className="text-xl font-bold mb-4 text-light border-b border-gray-700 pb-2">Chủ đề Python</h2>
            <ul className="space-y-2">
                {topics.map(topic => (
                    <li key={topic}>
                        <button
                            onClick={() => onSelectTopic(topic)}
                            className={`w-full text-left p-3 rounded-md transition-all duration-200 text-sm font-medium ${
                                selectedTopic === topic
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-dark-text hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {topic}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
