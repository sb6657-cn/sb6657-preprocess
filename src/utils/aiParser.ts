import { warriors15DonkPrompt } from '@/static/prompts';
import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import OpenAI from 'openai';

type AiStreamContent = {
    content: string;
    reasoningContent: string;
};

type DeepSeekStreamDelta = {
    content?: string | null;
    reasoning_content?: string | null;
};

type arrayExcel = (string | number)[][];
type OnContentChange = (content: AiStreamContent) => void;
export async function warriors15Aiparser(key: string, arrayExcel: arrayExcel, onContentChange?: OnContentChange): Promise<WarriorsDonk> {
    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: key,
        dangerouslyAllowBrowser: true,
    });

    const stream = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: warriors15DonkPrompt },
            { role: 'user', content: JSON.stringify(arrayExcel) },
        ],
        model: 'deepseek-v4-flash',
        reasoning_effort: 'high',
        stream: true,
        thinking: { type: 'enabled' },
    } as OpenAI.Chat.ChatCompletionCreateParamsStreaming);

    let content = '';
    let reasoningContent = '';
    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta as DeepSeekStreamDelta | undefined;
        const deltaContent = delta?.content;
        const deltaReasoningContent = delta?.reasoning_content;

        if (deltaReasoningContent) {
            reasoningContent += deltaReasoningContent;
        }
        if (deltaContent) {
            content += deltaContent;
        }

        if (deltaContent || deltaReasoningContent) {
            onContentChange?.({ content, reasoningContent });
        }
    }

    if (!content) {
        throw new Error('AI 未返回有效内容');
    }
    try {
        return JSON.parse(content) as WarriorsDonk;
    } catch {
        throw new Error('AI 返回内容无法解析为有效 JSON');
    }
}
