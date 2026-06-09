import type { WarriorsDonk } from '@/types/15WarriorsDonk';
import * as XLSX from 'xlsx';

export async function excelToArrarys(file: File) {
    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
        type: 'array',
        cellDates: true,
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
    }) as any[][];

    return rows;
}

export async function parseExcelFile(file: File): Promise<WarriorsDonk> {
    const rows = await excelToArrarys(file);

    const resultObj: WarriorsDonk = {
        match: { title: '', date: '' },
        updates: [],
        rankings: {
            warriors: [],
            victims: [],
        },
    };

    // 解析常规数据
    // 1. 布雷德十五勇士 donk十五受害者
    const tableHeader = rows[0];
    const playerIndex = tableHeader.findIndex((item: string) => item.trim() === 'player');
    const killIndex = tableHeader.findIndex((item: string) => item.trim() === 'kill');
    const deathIndex = tableHeader.findIndex((item: string) => item.trim() === 'death');
    const kdDiffIndex = tableHeader.findIndex((item: string) => item.trim() === 'k/dDiff');
    const mapsIndex = tableHeader.findIndex((item: string) => item.trim() === 'maps');
    const teamIndex = tableHeader.findIndex((item: string) => item.trim() === 'team');
    for (let i = 0; i < Math.min(rows.length, 15); i++) {
        // 正向，布雷德十五勇士
        const row1 = rows[i + 1];
        // 需要对donk的k/d大于0
        if (row1?.[kdDiffIndex] >= 0) {
            resultObj.rankings.warriors.push({
                rank: i + 1,
                player: row1[playerIndex],
                team: row1[teamIndex],
                kill: row1[killIndex],
                death: row1[deathIndex],
                maps: row1[mapsIndex],
                k_dDiff: row1[kdDiffIndex],
            });
        }
        // 反向，donk受害者
        const row2 = rows[rows.length - 1 - i];
        // 受害者需要k/d小于0
        if (row2[kdDiffIndex] < 0) {
            resultObj.rankings.victims.push({
                rank: i + 1,
                player: row2[playerIndex],
                team: row2[teamIndex],
                kill: row2[killIndex],
                death: row2[deathIndex],
                maps: row2[mapsIndex],
                k_dDiff: row2[kdDiffIndex],
            });
        }
    }
    // 2. 本场更新数据
    const rowAt = rows.findIndex((row, i) => i > 1 && row.includes('player'));
    const tableHeader2 = rows[rowAt];
    const playerIndex2 = tableHeader2.findIndex((item) => typeof item === 'string' && item.trim() === 'player');
    const killIndex2 = tableHeader2.findIndex((item) => typeof item === 'string' && item.trim() === 'kill');
    const deathIndex2 = tableHeader2.findIndex((item) => typeof item === 'string' && item.trim() === 'death');
    const mapsIndex2 = tableHeader2.findIndex((item) => typeof item === 'string' && item.trim() === 'maps');
    const teamIndex2 = tableHeader2.findIndex((item) => typeof item === 'string' && item.trim() === 'team');
    for (let i = rowAt + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[playerIndex2]) break;
        let killBefore = 0;
        let killAdded = 0;
        const kill: string | number = row[killIndex2];

        // 两种结构，一种是 'a+b=c'，取before=a，added=b。另一种只有一个数字，直接取added=数字
        if (typeof kill === 'string' && kill.includes('+')) {
            const temp1 = kill.split('+');
            killBefore = Number(temp1[0]);
            const temp2 = temp1[1].split('=');
            killAdded = Number(temp2[0]);
        } else {
            killAdded = Number(kill);
        }

        let deathBefore = 0;
        let deathAdded = 0;
        const death: string | number = row[deathIndex2];
        if (typeof death === 'string' && death.includes('+')) {
            const temp1 = death.split('+');
            deathBefore = Number(temp1[0]);
            const temp2 = temp1[1].split('=');
            deathAdded = Number(temp2[0]);
        } else {
            deathAdded = Number(death);
        }

        resultObj.updates.push({
            player: row[playerIndex2],
            team: row[teamIndex2],
            kill: {
                before: killBefore,
                added: killAdded,
                after: killBefore + killAdded,
            },
            death: {
                before: deathBefore,
                added: deathAdded,
                after: deathBefore + deathAdded,
            },
            maps: row[mapsIndex2],
        });
    }
    return resultObj;
}
