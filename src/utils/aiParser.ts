import { warriors15DonkPrompt } from '@/static/prompts';
import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import OpenAI from 'openai';

export async function warriors15Aiparser(key: string, arrayExcel: (string | number)[][]): Promise<WarriorsDonk> {
    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: key,
        dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: warriors15DonkPrompt },
            { role: 'user', content: JSON.stringify(arrayExcel) },
        ],
        model: 'deepseek-v4-flash',
        reasoning_effort: 'high',
        stream: false,
        // thinking: { type: 'enabled' },
    } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);
    console.log('ai', completion);

    const content = completion.choices[0]?.message.content;
    if (!content) {
        throw new Error('AI 未返回有效内容');
    }

    try {
        return JSON.parse(content) as WarriorsDonk;
    } catch {
        throw new Error('AI 返回内容无法解析为有效 JSON');
    }
}
