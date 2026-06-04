import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import { useEffect, useRef, useState } from 'react';
import styles from './Preview.module.scss';

const PREVIEW_URL = 'https://sb6657.cn/?preview=1#/15warriorsDonk';
// const PREVIEW_URL = 'http://localhost:5174/?preview=1#/15warriorsDonk';
const PREVIEW_ORIGIN = new URL(PREVIEW_URL).origin;

interface PreviewProps {
    parsedData?: WarriorsDonk;
}

export default function Preview(props: PreviewProps) {
    const { parsedData } = props;
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [iframeReady, setIframeReady] = useState(false);

    // 初始化的时候挂载监听iframe的ready状态监听器（来自子页面发送来的消息）
    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.origin !== PREVIEW_ORIGIN) return;
            if (event.data?.type === 'ready-to-preview') {
                setIframeReady(true);
            }
        }
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        if (!iframeReady || !parsedData) return;
        const iframeWindow = iframeRef?.current?.contentWindow;
        if (!iframeWindow) return;

        iframeWindow.postMessage(
            {
                type: 'preview-data',
                data: parsedData,
            },
            PREVIEW_ORIGIN
        );
    }, [iframeReady, parsedData]);

    return (
        <div className={styles.container}>
            <div className={styles.title}>sb6657.cn 实时预览↓</div>
            <div className={styles.previewContainer}>
                <iframe ref={iframeRef} title="sb6657-preview" src={PREVIEW_URL} className={styles.previewIframe} />
            </div>
        </div>
    );
}
