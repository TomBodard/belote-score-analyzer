
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Trophy, Trash2 } from "lucide-react";
import { getAllGames, deleteGame } from "@/services/storageService";
import { Game } from "@/types/belote";
import { formatDate, isGameComplete } from "@/utils/beloteUtils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = () => {
    const loadedGames = getAllGames();
    // Sort games by last updated (most recent first)
    loadedGames.sort((a, b) => b.lastUpdated - a.lastUpdated);
    setGames(loadedGames);
  };

  const handleDeleteGame = (gameId: string) => {
    try {
      const success = deleteGame(gameId);
      if (success) {
        setGames(games.filter(game => game.id !== gameId));
        toast.success("Game deleted successfully");
      } else {
        toast.error("Failed to delete game");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("An error occurred while deleting the game");
    }
    setGameToDelete(null);
  };

  const getGameStatusBadge = (game: Game) => {
    const isComplete = isGameComplete(game.usScore, game.themScore, game.targetScore);
    
    if (isComplete) {
      const winner = game.usScore >= game.themScore ? game.usTeamName : game.themTeamName;
      return (
        <Badge className="bg-belote-primary text-white">
          <Trophy className="h-3 w-3 mr-1" />
          {winner} Won
        </Badge>
      );
    }
    
    if (game.rounds.length === 0) {
      return (
        <Badge variant="outline" className="border-belote-light text-belote-light">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Not Started
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-belote-secondary text-white">
        <Clock className="h-3 w-3 mr-1" />
        In Progress
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {games.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No games found. Create a new game to get started!</p>
          </CardContent>
        </Card>
      ) : (
        games.map((game) => (
          <Card key={game.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{game.title}</CardTitle>
                  <CardDescription>
                    Created {formatDate(game.createdAt)}
                  </CardDescription>
                </div>
                {getGameStatusBadge(game)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-center p-2 bg-accent rounded-lg">
                  <p className="text-sm font-medium">{game.usTeamName}</p>
                  <p className="text-2xl font-bold">{game.usScore}</p>
                </div>
                <div className="text-center p-2 bg-accent rounded-lg">
                  <p className="text-sm font-medium">{game.themTeamName}</p>
                  <p className="text-2xl font-bold">{game.themScore}</p>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Target: {game.targetScore} points • Rounds: {game.rounds.length}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog open={gameToDelete === game.id} onOpenChange={(open) => !open && setGameToDelete(null)}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setGameToDelete(game.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Game</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{game.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteGame(game.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Link to={`/game/${game.id}`} className="w-full ml-2">
                <Button variant="default" className="w-full">View Game</Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default GamesList;
