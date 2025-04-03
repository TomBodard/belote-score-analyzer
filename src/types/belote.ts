
export type Team = "us" | "them";

export type ScoreType = "normal" | "capot" | "belote" | "rebelote";

export type BeloteContract = "80" | "90" | "100" | "110" | "120" | "130" | "140" | "150" | "160" | "capot";

export type GameStatus = "not-started" | "in-progress" | "finished";

export type TrumpCard = "hearts" | "diamonds" | "clubs" | "spades" | "no-trump" | "all-trump";

export interface Round {
  id: string;
  bidTeam: Team;
  bidContract: BeloteContract;
  trumpCard: TrumpCard;
  bidSuccess: boolean;
  usPoints: number;
  themPoints: number;
  beloteTeam?: Team;
  notes?: string;
  timestamp: number;
}

export interface Game {
  id: string;
  title: string;
  usTeamName: string;
  themTeamName: string;
  usScore: number;
  themScore: number;
  rounds: Round[];
  status: GameStatus;
  targetScore: number;
  createdAt: number;
  lastUpdated: number;
}
