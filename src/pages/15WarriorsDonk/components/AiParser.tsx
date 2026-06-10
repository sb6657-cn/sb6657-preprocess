import { oceanColors } from '@/static/colors';
import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import { getSavedDeepSeekApiKey, saveDeepSeekApiKey } from '@/utils/apiKeyStorage';
import { warriors15Aiparser } from '@/utils/aiParser';
import { excelToArrarys } from '@/utils/excel';
import { downloadJson } from '@/utils/json';
import { ArrowRightOutlined, DownloadOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { BorderBeam, Button, Checkbox, Divider, Input, message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { useEffect, useRef, useState } from 'react';
import styles from './AiParser.module.scss';

interface AiParserProps {
    onSyncAndPreview: (data?: WarriorsDonk) => void;
}

export default function AiParser(props: AiParserProps) {
    const { onSyncAndPreview } = props;
    const [savedApiKey] = useState(getSavedDeepSeekApiKey);
    // ai的api key
    const [apiKey, setApiKey] = useState(savedApiKey);
    const [rememberApiKey, setRememberApiKey] = useState(!!savedApiKey);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const excelFile = fileList[0];
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState<WarriorsDonk>();
    // ai输出内容
    const [streamContent, setStreamContent] = useState('');
    const [reasoningContent, setReasoningContent] = useState('');
    const beforeOpenFile = fileList.length < 1 && !!apiKey;
    // 输入框填写的标题和日期
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    // ai输出内容的ref，主要用于自动滚动到最底部
    const streamOutputRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        const streamOutput = streamOutputRef.current;
        if (!streamOutput) return;

        streamOutput.scrollTop = streamOutput.scrollHeight;
    }, [streamContent, reasoningContent]);

    function saveApiKeyToStorage(nextApiKey: string) {
        const saved = saveDeepSeekApiKey(nextApiKey);
        if (!saved) {
            messageApi.warning('当前浏览器不允许保存 API Key，本次仅临时使用');
        }
    }

    function handleApiKeyChange(nextApiKey: string) {
        setApiKey(nextApiKey);
        if (rememberApiKey) {
            saveApiKeyToStorage(nextApiKey);
        }
    }

    function handleRememberApiKeyChange(checked: boolean) {
        setRememberApiKey(checked);
        if (checked) {
            saveApiKeyToStorage(apiKey);
        } else {
            saveApiKeyToStorage('');
        }
    }

    // 解析excel相关函数
    async function parseExcel(file: File) {
        if (!file || parsing || !apiKey) return;
        setParsing(true);
        setParsedData(undefined);
        setStreamContent('');
        setReasoningContent('');

        try {
            const arraysExcel = await excelToArrarys(file);
            const jsonData = await warriors15Aiparser(apiKey, arraysExcel, ({ content, reasoningContent }) => {
                setStreamContent(content);
                setReasoningContent(reasoningContent);
            });
            setParsedData(jsonData);
        } catch (error) {
            const reason = error instanceof Error ? error.message : '未知错误';
            messageApi.error(`大模型输出错误（${reason}），请删除当前文件后重新上传`);
            setParsedData(undefined);
            onSyncAndPreview(undefined);
            setFileList([]);
        } finally {
            setParsing(false);
        }
    }

    // 上传按钮组件相关函数
    function handleUploadButtonClick() {
        if (fileList.length > 0) {
            messageApi.warning('一次只能转换一个文件，请删除当前文件再上传');
        }
        if (!apiKey) {
            messageApi.warning('请先填写API Key');
        }
    }
    function handleRemove(file: UploadFile) {
        setFileList((current) => current.filter((item) => item.uid !== file.uid));
        setParsedData(undefined);
        setStreamContent('');
        setReasoningContent('');
        onSyncAndPreview(undefined);
        setParsing(false);
    }
    function handleBeforeUpload(file: UploadFile) {
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            messageApi.error('请上传正确的文件格式，此处只支持.xlsx');
            return Upload.LIST_IGNORE;
        }
        setFileList([...fileList, file]);
        parseExcel(file as RcFile);
        return false;
    }

    // 下载按钮
    function downloadFile() {
        if (!parsedData) {
            messageApi.error('未找到已解析文件');
            return;
        }
        const currentJson = structuredClone(parsedData);
        currentJson.match.title = title;
        currentJson.match.date = date;
        downloadJson(currentJson, '15warriorsDonk_2026.json');
    }

    // 预览按钮
    function handlePreview() {
        if (!parsedData) {
            messageApi.error('没有解析数据，无法预览');
            return;
        }
        const currentJson = structuredClone(parsedData);
        currentJson.match.title = title;
        currentJson.match.date = date;
        onSyncAndPreview(currentJson);
    }

    return (
        <div className={styles.container1}>
            {contextHolder}
            <BorderBeam color={oceanColors}>
                <div className={styles.container2}>
                    <div className={styles.apiKeySection}>
                        <div className={styles.apiKeyRow}>
                            <span className={styles.apiKeyLabel}>DeepSeek API Key:</span>
                            <Input.Password className={styles.apiKeyInput} placeholder="sk-xxxxxxxx" value={apiKey} onChange={(e) => handleApiKeyChange(e.target.value)} autoComplete="off" />
                            <Checkbox checked={rememberApiKey} onChange={(e) => handleRememberApiKeyChange(e.target.checked)}>
                                记住key
                            </Checkbox>
                        </div>
                        {rememberApiKey && <span className={styles.apiKeyTip}>勾选后Key会保存到当前浏览器localStorage。请勿在不信任的浏览器环境中填写</span>}
                    </div>
                    <Divider />
                    <div className={styles.uploadAndDownload}>
                        <div className={styles.upload}>
                            <div className={styles.tips}>仅支持 .xlsx 文件，一次只能处理一个文件</div>
                            <Upload fileList={fileList} maxCount={1} onRemove={handleRemove} beforeUpload={handleBeforeUpload} openFileDialogOnClick={beforeOpenFile}>
                                <Button icon={<UploadOutlined />} onClick={handleUploadButtonClick}>
                                    上传Excel
                                </Button>
                            </Upload>
                            <div className={styles.formTitle}>补充信息</div>
                            <div className={styles.additional}>
                                <span className={styles.title}>标题:</span>
                                <Input size="small" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="如: Spirit冠军 | PGL阿斯塔纳2026" />
                            </div>
                            <div className={styles.additional}>
                                <span className={styles.title}>日期:</span>
                                <Input size="small" value={date} onChange={(e) => setDate(e.target.value)} placeholder="如: 2026-05-17" />
                            </div>
                        </div>
                        <ArrowRightOutlined className={styles.rightArrow} />
                        <div className={styles.download}>
                            {!excelFile && !streamContent && !reasoningContent && <span>请上传 .xlsx 文件</span>}
                            {parsing && (
                                <div className={styles.streamOutput}>
                                    <div className={styles.streamTitle}>{streamContent ? '正在生成JSON, 输出完成后会自动解析' : 'AI正在思考，稍后开始输出 JSON'}</div>
                                    <pre ref={streamOutputRef} className={styles.streamContent}>
                                        <code>{streamContent || reasoningContent || '等待AI开始输出...'}</code>
                                    </pre>
                                </div>
                            )}
                            {!parsing && parsedData && (
                                <Button icon={<DownloadOutlined />} onClick={downloadFile}>
                                    下载json
                                </Button>
                            )}
                        </div>
                    </div>
                    <Divider />
                    <div className={styles.previewContainer}>
                        <Button icon={<EyeOutlined />} onClick={handlePreview}>
                            实时预览
                        </Button>
                    </div>
                </div>
            </BorderBeam>
        </div>
    );
}
