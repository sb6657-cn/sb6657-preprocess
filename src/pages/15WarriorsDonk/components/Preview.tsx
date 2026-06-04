import styles from './Preview.module.scss';
import type { WarriorsDonk } from '@/types/15WarriorsDonk';
interface PreviewProps {
    parsedData: WarriorsDonk;
}

export default function Preview(props: PreviewProps) {
    const { parsedData } = props;
    return <div className={styles.container}>{parsedData && <em>TODO: 实时预览</em>}</div>;
}
