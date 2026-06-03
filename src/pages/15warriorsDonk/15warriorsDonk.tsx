import styles from './15WarriorsDonk.module.scss'
import ExcelParser from './components/ExcelParser';
import Preview from './components/Preview';

export default function Warriors15Donk() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <div className={styles.mainTitle}>布雷德十五勇士excel数据解析</div>
                <div className={styles.subTitle}>大佬提供的excel → 网站用json</div>
            </div>
            <ExcelParser/>
            <Preview />
        </div>
    );
}
