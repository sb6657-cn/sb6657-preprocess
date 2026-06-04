import { apiBaseUrl, apiSections } from '@/static/apiCatalog';
import styles from './ApiCatalog.module.scss';

export default function ApiCatalog() {
    const endpointCount = apiSections.reduce((count, section) => count + section.endpoints.length, 0);

    return (
        <main className={styles.container}>
            <header className={styles.hero}>
                <div>
                    <p className={styles.eyebrow}>PUBLIC API</p>
                    <h1>sb6657 开源接口一览</h1>
                    <p className={styles.intro}>按功能整理常用公开接口，方便查询、接入和二次开发。</p>
                </div>
                <aside className={styles.baseUrl}>
                    <span>接口根地址</span>
                    <code>{apiBaseUrl}</code>
                    <small>{endpointCount} 个公开接口</small>
                </aside>
            </header>

            <div className={styles.sections}>
                {apiSections.map((section) => (
                    <section className={styles.section} key={section.title}>
                        <div className={styles.sectionHeader}>
                            <h2>{section.title}</h2>
                            <p>{section.description}</p>
                        </div>
                        <div className={styles.endpointList}>
                            {section.endpoints.map((endpoint) => (
                                <article className={styles.endpoint} key={`${endpoint.method}-${endpoint.path}`}>
                                    <span className={`${styles.method} ${styles[endpoint.method.toLowerCase()]}`}>{endpoint.method}</span>
                                    <div className={styles.endpointBody}>
                                        <div className={styles.endpointTitle}>
                                            <strong>{endpoint.title}</strong>
                                            <code>{endpoint.path}</code>
                                        </div>
                                        <p className={styles.params}>{endpoint.params || <span className={styles.emptyParams}>无参数</span>}</p>
                                        {endpoint.note && <p className={styles.note}>{endpoint.note}</p>}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}
