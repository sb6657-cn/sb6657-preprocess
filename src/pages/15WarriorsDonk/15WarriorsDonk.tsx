import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import { useState } from 'react';
import styles from './15WarriorsDonk.module.scss';
import ExcelParser from './components/ExcelParser';
import AiParser from './components/AiParser';
import Preview from './components/Preview';
import { Radio } from 'antd';

export default function Warriors15Donk() {
    const [mode, setMode] = useState<'program-parse' | 'ai-parse'>('program-parse');
    const options = [
        { label: '固定规则解析', value: 'program-parse' },
        { label: 'AI模型解析', value: 'ai-parse' },
    ];

    const [parsedData, setParsedData] = useState<WarriorsDonk>();
    function syncAndPreview(data?: WarriorsDonk) {
        setParsedData(data);
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <p className={styles.eyebrow}>EXCEL TO JSON</p>
                <div className={styles.mainTitle}>布雷德十五勇士excel数据解析</div>
                <div className={styles.subTitle}>大佬提供的excel → 网站用json</div>
            </div>
            <div className={styles.modeSelector}>
                <Radio.Group options={options} value={mode} onChange={(e) => setMode(e.target.value)} optionType="button" buttonStyle="solid" />
            </div>
            {mode === 'program-parse' && <ExcelParser onSyncAndPreview={syncAndPreview} />}
            {mode === 'ai-parse' && <AiParser onSyncAndPreview={syncAndPreview} />}
            {parsedData && <Preview parsedData={parsedData} />}
        </div>
    );
}
