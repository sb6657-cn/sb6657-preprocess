export type WarriorsDonk = {
    match: { title: string; date: string };
    updates: UpdateRow[];
    rankings: { warriors: RankItem[]; victims: RankItem[] };
    // loading?: boolean;
};
type KDDetail = { before: number; added: number; after: number };
type UpdateRow = { player: string; team: string; kill: KDDetail; death: KDDetail; maps: number };
type RankItem = { rank: number; player: string; team: string; kill: number; death: number; maps: number; k_dDiff: number };
