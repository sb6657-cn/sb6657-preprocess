import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import { BorderBeam, Input, Divider, Button } from 'antd';
import styles from './AiParser.module.scss';
import { oceanColors } from '@/static/colors';
import { useState } from 'react';

interface AiParserProps {
    onSyncAndPreview: (data?: WarriorsDonk) => void;
}

export default function AiParser(props: AiParserProps) {
    const { onSyncAndPreview } = props;
    const [apiKey, setApiKey] = useState('');

    console.log(111, apiKey);

    return (
        <div className={styles.container1}>
            <BorderBeam color={oceanColors}>
                <div className={styles.container2}>
                    <div className={styles.ApiInputContainer}>
                        <span className={styles.ApiInputTitle}>DeepSeek API Key:</span>
                        <Input className={styles.ApiInput} placeholder="sk-xxxxxxxx" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                    </div>
                    <Divider />
                </div>
            </BorderBeam>
        </div>
    );
}
