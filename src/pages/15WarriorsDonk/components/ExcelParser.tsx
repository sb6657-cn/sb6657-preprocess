import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import { parseExcelFile } from '@/utils/excel';
import { downloadJson } from '@/utils/json';
import { ArrowRightOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, Input, message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { useState } from 'react';

import styles from './ExcelParser.module.scss';

export default function ExcelParser() {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const excelFile = fileList[0];
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState<WarriorsDonk>();
    // 输入框填写的标题和日期
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    // 解析excel相关函数
    async function parseExcel(file: File) {
        if (!file || parsing) return;
        setParsing(true);

        const jsonData = await parseExcelFile(file);
        setParsedData(jsonData);
        setParsing(false);
    }

    // 上传按钮组件相关函数
    function handleUploadButtonClick() {
        if (fileList.length > 0) {
            messageApi.warning('一次只能转换一个文件，请删除当前文件再上传');
        }
    }
    function handleRemove(file: UploadFile) {
        setFileList((current) => current.filter((item) => item.uid !== file.uid));
        setParsedData(undefined);
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

    return (
        <div className={styles.container}>
            {contextHolder}
            <div className={styles.upload}>
                <div className={styles.tips}>仅支持 .xlsx 文件，一次只能处理一个文件</div>
                <Upload fileList={fileList} maxCount={1} onRemove={handleRemove} beforeUpload={handleBeforeUpload} openFileDialogOnClick={fileList.length < 1}>
                    <Button icon={<UploadOutlined />} onClick={handleUploadButtonClick}>
                        上传Excel
                    </Button>
                </Upload>
                <div className={styles.additional}>
                    <span className={styles.title}>标题:</span>
                    <Input size="small" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className={styles.additional}>
                    <span className={styles.title}>日期:</span>
                    <Input size="small" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <ArrowRightOutlined className={styles.rightArrow} />
            <div className={styles.download}>
                {!excelFile && <span>请上传 .xlsx 文件</span>}
                {parsing && <span>正在解析 Excel...</span>}
                {!parsing && parsedData && (
                    <Button icon={<DownloadOutlined />} onClick={downloadFile}>
                        下载json
                    </Button>
                )}
            </div>
        </div>
    );
}
