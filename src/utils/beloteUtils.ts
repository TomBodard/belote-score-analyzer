
import { BeloteContract, Team, TrumpCard, Round } from "@/types/belote";

// Points for each contract
export const contractPoints: Record<BeloteContract, number> = {
  "80": 80,
  "90": 90,
  "100": 100,
  "110": 110,
  "120": 120,
  "130": 130,
  "140": 140,
  "150": 150,
  "160": 160,
  "capot": 250,
};

// Belote and rebelote points
export const BELOTE_POINTS = 20;

// Total points available in a normal game
export const TOTAL_POINTS_NO_TRUMP = 152;
export const TOTAL_POINTS_WITH_TRUMP = 162;

// Calculate contract success
export function isContractSuccessful(
  contract: BeloteContract,
  bidTeamPoints: number,
  trumpCard: TrumpCard
): boolean {
  const requiredPoints = contractPoints[contract];
  return bidTeamPoints >= requiredPoints;
}

// Calculate round points
export function calculateRoundScore(
  bidTeam: Team,
  bidContract: BeloteContract,
  trumpCard: TrumpCard,
  usPoints: number,
  themPoints: number,
  beloteTeam?: Team
): { usScore: number; themScore: number } {
  // Add belote points if applicable
  if (beloteTeam === "us") {
    usPoints += BELOTE_POINTS;
  } else if (beloteTeam === "them") {
    themPoints += BELOTE_POINTS;
  }

  const totalPoints = trumpCard === "no-trump" 
    ? TOTAL_POINTS_NO_TRUMP 
    : TOTAL_POINTS_WITH_TRUMP;
  
  const bidTeamPoints = bidTeam === "us" ? usPoints : themPoints;
  const otherTeamPoints = bidTeam === "us" ? themPoints : usPoints;
  
  const success = isContractSuccessful(bidContract, bidTeamPoints, trumpCard);
  
  let usScore = 0;
  let themScore = 0;
  
  if (success) {
    // Bid team gets their points
    if (bidTeam === "us") {
      usScore = usPoints;
      themScore = themPoints;
    } else {
      usScore = usPoints;
      themScore = themPoints;
    }
  } else {
    // Bid team loses, other team gets all points
    if (bidTeam === "us") {
      usScore = 0;
      themScore = totalPoints;
    } else {
      usScore = totalPoints;
      themScore = 0;
    }
  }
  
  return { usScore, themScore };
}

// Calculate total game score
export function calculateGameScore(rounds: Round[]): { usScore: number; themScore: number } {
  let usScore = 0;
  let themScore = 0;
  
  rounds.forEach(round => {
    usScore += round.usPoints;
    themScore += round.themPoints;
  });
  
  return { usScore, themScore };
}

// Generate readable round summary
export function generateRoundSummary(round: Round): string {
  const bidTeamName = round.bidTeam === "us" ? "Us" : "Them";
  const bidOutcome = round.bidSuccess ? "Success" : "Failed";
  const trumpSymbol = getTrumpSymbol(round.trumpCard);
  
  return `${bidTeamName} bid ${round.bidContract} ${trumpSymbol} - ${bidOutcome}`;
}

// Get trump card symbol
export function getTrumpSymbol(trump: TrumpCard): string {
  switch (trump) {
    case "hearts": return "♥";
    case "diamonds": return "♦";
    case "clubs": return "♣";
    case "spades": return "♠";
    case "no-trump": return "NT";
    case "all-trump": return "AT";
    default: return "";
  }
}

// Get trump card color class
export function getTrumpColorClass(trump: TrumpCard): string {
  switch (trump) {
    case "hearts": 
    case "diamonds": 
      return "text-belote-dark";
    case "clubs": 
    case "spades": 
      return "text-belote-primary";
    case "no-trump": 
      return "text-blue-600";
    case "all-trump": 
      return "text-belote-light";
    default: 
      return "";
  }
}

// Format date
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calculate if game is complete
export function isGameComplete(usScore: number, themScore: number, targetScore: number): boolean {
  return usScore >= targetScore || themScore >= targetScore;
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
