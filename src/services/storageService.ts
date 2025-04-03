
import { Game, Round } from "@/types/belote";
import { generateId } from "@/utils/beloteUtils";

const GAMES_STORAGE_KEY = "belote-games";

// Get all games from local storage
export function getAllGames(): Game[] {
  try {
    const gamesJson = localStorage.getItem(GAMES_STORAGE_KEY);
    if (!gamesJson) return [];
    return JSON.parse(gamesJson);
  } catch (error) {
    console.error("Error loading games from storage:", error);
    return [];
  }
}

// Get a specific game by ID
export function getGameById(gameId: string): Game | null {
  const games = getAllGames();
  return games.find(game => game.id === gameId) || null;
}

// Save a new game to storage
export function saveNewGame(game: Omit<Game, "id" | "createdAt" | "lastUpdated">): Game {
  const games = getAllGames();
  const timestamp = Date.now();
  
  const newGame: Game = {
    ...game,
    id: generateId(),
    createdAt: timestamp,
    lastUpdated: timestamp
  };
  
  games.push(newGame);
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  
  return newGame;
}

// Update an existing game
export function updateGame(updatedGame: Game): Game {
  const games = getAllGames();
  const index = games.findIndex(g => g.id === updatedGame.id);
  
  if (index === -1) {
    throw new Error(`Game with ID ${updatedGame.id} not found`);
  }
  
  const gameToUpdate = {
    ...updatedGame,
    lastUpdated: Date.now()
  };
  
  games[index] = gameToUpdate;
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  
  return gameToUpdate;
}

// Add a round to a game
export function addRoundToGame(gameId: string, round: Omit<Round, "id" | "timestamp">): Game {
  const game = getGameById(gameId);
  
  if (!game) {
    throw new Error(`Game with ID ${gameId} not found`);
  }
  
  const newRound: Round = {
    ...round,
    id: generateId(),
    timestamp: Date.now()
  };
  
  const updatedGame: Game = {
    ...game,
    rounds: [...game.rounds, newRound],
    usScore: game.usScore + round.usPoints,
    themScore: game.themScore + round.themPoints,
    lastUpdated: Date.now()
  };
  
  return updateGame(updatedGame);
}

// Delete a game
export function deleteGame(gameId: string): boolean {
  const games = getAllGames();
  const filteredGames = games.filter(game => game.id !== gameId);
  
  if (filteredGames.length === games.length) {
    return false; // No game was deleted
  }
  
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(filteredGames));
  return true;
}

// Delete a round from a game
export function deleteRound(gameId: string, roundId: string): Game | null {
  const game = getGameById(gameId);
  
  if (!game) {
    return null;
  }
  
  const roundIndex = game.rounds.findIndex(r => r.id === roundId);
  
  if (roundIndex === -1) {
    return null;
  }
  
  const roundToRemove = game.rounds[roundIndex];
  const updatedRounds = game.rounds.filter(r => r.id !== roundId);
  
  const updatedGame: Game = {
    ...game,
    rounds: updatedRounds,
    usScore: game.usScore - roundToRemove.usPoints,
    themScore: game.themScore - roundToRemove.themPoints,
    lastUpdated: Date.now()
  };
  
  return updateGame(updatedGame);
}
