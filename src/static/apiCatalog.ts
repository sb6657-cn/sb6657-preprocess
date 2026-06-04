export type ApiMethod = 'GET' | 'POST';

export interface ApiEndpoint {
    method: ApiMethod;
    path: string;
    title: string;
    params?: string;
    note?: string;
}

export interface ApiSection {
    title: string;
    description: string;
    endpoints: ApiEndpoint[];
}

export const apiBaseUrl = 'https://hguofichp.cn:10086';

export const apiSections: ApiSection[] = [
    {
        title: '烂梗库',
        description: '烂梗浏览、搜索、标签和详情数据。',
        endpoints: [
            { method: 'GET', path: '/machine/hotBarrageOf24H', title: '获取 24 小时热门烂梗' },
            { method: 'GET', path: '/machine/hotBarrageOf7Day', title: '获取 7 天热门烂梗' },
            { method: 'GET', path: '/machine/Page', title: '分页获取烂梗列表', params: 'pageNum, pageSize, tags?' },
            { method: 'GET', path: '/machine/sortAllBarrage', title: '分页获取排序后的烂梗列表', params: 'pageNum, pageSize, tags?' },
            { method: 'POST', path: '/machine/pageSearch', title: '搜索烂梗', params: 'barrage?, tags?, submitTime?, sort?, pageNum?, pageSize?' },
            { method: 'GET', path: '/machine/getRandOne', title: '随机获取一条烂梗' },
            { method: 'GET', path: '/machine/dictList', title: '获取烂梗标签字典' },
            { method: 'GET', path: '/machine/getBarrageInfo/{barrageId}', title: '根据 ID 获取烂梗详情', params: 'barrageId path 参数' },
            { method: 'GET', path: '/machine/WordCloud', title: '获取首页词云数据' },
        ],
    },
    {
        title: '屏蔽词',
        description: '屏蔽词列表和字典数据。',
        endpoints: [
            { method: 'GET', path: '/machine/getShieldWordDict', title: '获取屏蔽词字典' },
            { method: 'GET', path: '/machine/getShieldWordList', title: '分页获取屏蔽词列表', params: 'pageNum, pageSize' },
        ],
    },
    {
        title: '赛事与赛事烂梗',
        description: '赛事信息、队伍池和赛事烂梗库。',
        endpoints: [
            { method: 'GET', path: '/machine/InProgressMatch', title: '获取正在进行的赛事' },
            { method: 'GET', path: '/machine/matches', title: '获取赛事预测阶段信息' },
            { method: 'GET', path: '/machine/matches/{matchId}/teams', title: '获取赛事队伍池', params: 'phase' },
            { method: 'GET', path: '/machine/getMatchList', title: '分页获取赛事列表', params: 'pageNum, pageSize' },
            { method: 'GET', path: '/machine/matchPageList', title: '分页获取某赛事烂梗', params: 'matchId, pageNum, pageSize' },
        ],
    },
    {
        title: '时光相册',
        description: '图片瀑布流数据。',
        endpoints: [{ method: 'GET', path: '/machine/showImage', title: '分页获取图片列表', params: 'pageNum, pageSize' }],
    },
    {
        title: 'OSS 静态数据',
        description: '静态页面直接读取的公开 JSON 数据。',
        endpoints: [
            { method: 'GET', path: 'https://sb6657oss.wishao.fun/15warriorsDonk_2026.json', title: '布雷德十五勇士战报 2026' },
            { method: 'GET', path: 'https://sb6657oss.wishao.fun/15warriorsDonk_2025.json', title: '布雷德十五勇士战报 2025' },
            { method: 'GET', path: 'https://sb6657oss.wishao.fun/dejaVuNiko.json', title: '超级逮虾户战报' },
            { method: 'GET', path: 'https://sb6657oss.wishao.fun/memeTop20_2025.json', title: '年度烂梗 Top20 2025' },
            { method: 'GET', path: 'https://sb6657oss.wishao.fun/memeTop20_2024.json', title: '年度烂梗 Top20 2024' },
        ],
    },
];
