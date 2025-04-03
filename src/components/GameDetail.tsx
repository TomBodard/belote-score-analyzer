
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameById } from "@/services/storageService";
import { Game, Round } from "@/types/belote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, ClipboardList, Plus } from "lucide-react";
import { formatDate, generateRoundSummary, getTrumpSymbol, getTrumpColorClass, isGameComplete } from "@/utils/beloteUtils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import NewRoundForm from "./NewRoundForm";
import RoundsTable from "./RoundsTable";
import GameStats from "./GameStats";

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [activeTab, setActiveTab] = useState("rounds");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    loadGame();
  }, [id, navigate]);

  const loadGame = () => {
    setIsLoading(true);
    try {
      const loadedGame = getGameById(id!);
      if (!loadedGame) {
        navigate("/");
        return;
      }
      setGame(loadedGame);
    } catch (error) {
      console.error("Error loading game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !game) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading game...</p>
      </div>
    );
  }

  const gameComplete = isGameComplete(game.usScore, game.themScore, game.targetScore);
  const winner = game.usScore > game.themScore ? game.usTeamName : game.themTeamName;
  const progressPercentage = Math.min(
    100,
    Math.max(game.usScore, game.themScore) / game.targetScore * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
        {gameComplete && (
          <Badge className="bg-belote-primary text-white px-3 py-1">
            {winner} Wins!
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{game.title}</CardTitle>
          <CardDescription>
            Created on {formatDate(game.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{game.usTeamName}</span>
              <span className="font-medium">{game.targetScore} points</span>
              <span className="font-medium">{game.themTeamName}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xl font-bold">{game.usScore}</span>
              <span className="text-xs text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
              <span className="text-xl font-bold">{game.themScore}</span>
            </div>
          </div>

          {game.rounds.length > 0 && (
            <div className="bg-accent rounded-lg p-3 mb-5">
              <p className="text-sm font-medium mb-1">Last Round:</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`text-lg mr-1 ${getTrumpColorClass(game.rounds[game.rounds.length - 1].trumpCard)}`}>
                    {getTrumpSymbol(game.rounds[game.rounds.length - 1].trumpCard)}
                  </span>
                  <span>{generateRoundSummary(game.rounds[game.rounds.length - 1])}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{game.rounds[game.rounds.length - 1].usPoints}</Badge>
                  <Badge variant="outline">{game.rounds[game.rounds.length - 1].themPoints}</Badge>
                </div>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="rounds" className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Rounds
              </TabsTrigger>
              <TabsTrigger value="add" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Round
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Stats
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rounds">
              <RoundsTable 
                rounds={game.rounds} 
                usTeamName={game.usTeamName} 
                themTeamName={game.themTeamName}
                gameId={game.id}
                onRoundDeleted={loadGame}
              />
            </TabsContent>
            
            <TabsContent value="add">
              <NewRoundForm 
                gameId={game.id} 
                usTeamName={game.usTeamName} 
                themTeamName={game.themTeamName}
                onRoundAdded={loadGame}
              />
            </TabsContent>
            
            <TabsContent value="stats">
              <GameStats game={game} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameDetail;
