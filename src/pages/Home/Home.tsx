import { Link } from 'react-router';
import styles from './Home.module.scss';

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <img className={styles.icon} src="https://apic.douyucdn.cn/upload/avatar_v3/201905/badbf01f7ab943358bf78bcd9245305f_big.jpg" alt="icon" />
                <span className={styles.text}>sb6657 便捷工具集</span>
            </div>
            <div className={styles.content}>
                <Link to="/15warriorsDonk">
                    <span className={styles.linkText}>布雷德十五勇士excel数据解析</span>
                </Link>
                <Link to="/apiCatalog">
                    <span className={styles.linkText}>sb6657 开源接口一览</span>
                </Link>
            </div>
        </div>
    );
}
