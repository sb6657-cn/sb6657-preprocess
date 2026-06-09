import { warriors15DonkPrompt } from '@/static/prompts';
import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import OpenAI from 'openai';

export async function warriors15Aiparser(key: string, arrayExcel: (string | number)[][]): Promise<WarriorsDonk> {
    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: key,
        dangerouslyAllowBrowser: true,
    });
    console.log(3333);

    const response = await openai.responses.create({
        model: 'deepseek-v4-flash',
        input: `${warriors15DonkPrompt}\n${JSON.stringify(arrayExcel)}`,
    });
    console.log('ai', response);

    return JSON.parse(response.output_text) as WarriorsDonk;
}
