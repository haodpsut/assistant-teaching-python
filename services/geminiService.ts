
import { GoogleGenAI } from "@google/genai";
import type { Lesson, Feedback } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T,>(jsonString: string): T => {
    let cleanJsonString = jsonString.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonString.match(fenceRegex);
    if (match && match[2]) {
        cleanJsonString = match[2].trim();
    }
    
    try {
        return JSON.parse(cleanJsonString);
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Original string:", jsonString);
        throw new Error("Phản hồi từ AI không đúng định dạng JSON.");
    }
};

export const generateLesson = async (topic: string): Promise<Lesson> => {
    const prompt = `Bạn là một trợ giảng lập trình Python chuyên nghiệp. Hãy giải thích ngắn gọn, súc tích về chủ đề "${topic}" bằng tiếng Việt. Cung cấp một đoạn code ví dụ đơn giản, dễ hiểu bằng Python để minh họa. Trả lời dưới dạng JSON với hai key: "theory" và "code".`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.3
        },
    });

    return parseJsonResponse<Lesson>(response.text);
};

export const generateAssignment = async (topic: string): Promise<string> => {
    const prompt = `Bạn là một giáo viên lập trình Python. Hãy tạo một bài tập nhỏ liên quan đến chủ đề "${topic}" cho người mới bắt đầu. Chỉ cung cấp đề bài, không cung cấp lời giải. Giữ đề bài ngắn gọn, khoảng 2-3 câu, bằng tiếng Việt.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            temperature: 0.8
        }
    });

    return response.text;
};

export const gradeSubmission = async (assignment: string, studentCode: string): Promise<Feedback> => {
    const prompt = `
        Bạn là một chuyên gia chấm bài lập trình Python. Nhiệm vụ của bạn là đánh giá code của học viên.
        Đề bài là: "${assignment}"
        
        Code của học viên:
        \`\`\`python
        ${studentCode}
        \`\`\`

        Hãy thực hiện các công việc sau và trả lời dưới dạng JSON:
        1.  **Chấm điểm (score):** Cho điểm từ 0 đến 100 dựa trên mức độ chính xác, hiệu quả và phong cách code.
        2.  **Nhận xét (comments):** Đưa ra nhận xét chi tiết, mang tính xây dựng về những điểm tốt và những điểm cần cải thiện. Giải thích lỗi sai nếu có. Nhận xét bằng tiếng Việt, viết dưới dạng markdown.
        3.  **Sửa code (correctedCode):** Cung cấp phiên bản code đã được sửa lại cho đúng và tối ưu hơn (nếu cần).

        Format JSON trả về phải có cấu trúc như sau:
        {
          "score": <number>,
          "comments": "<string>",
          "correctedCode": "<string>"
        }
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.2
        },
    });

    return parseJsonResponse<Feedback>(response.text);
};
