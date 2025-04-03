
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { saveNewGame } from "@/services/storageService";
import { GameStatus } from "@/types/belote";

const NewGameForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [usTeamName, setUsTeamName] = useState("Us");
  const [themTeamName, setThemTeamName] = useState("Them");
  const [targetScore, setTargetScore] = useState("1000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a game title");
      return;
    }

    try {
      const parsedTargetScore = parseInt(targetScore, 10);
      
      if (isNaN(parsedTargetScore) || parsedTargetScore <= 0) {
        toast.error("Please enter a valid target score");
        return;
      }
      
      const newGame = saveNewGame({
        title: title.trim(),
        usTeamName: usTeamName.trim() || "Us",
        themTeamName: themTeamName.trim() || "Them",
        usScore: 0,
        themScore: 0,
        rounds: [],
        status: "not-started" as GameStatus,
        targetScore: parsedTargetScore,
      });
      
      toast.success("Game created successfully!");
      navigate(`/game/${newGame.id}`);
    } catch (error) {
      console.error("Error creating game:", error);
      toast.error("Failed to create game. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">New Belote Game</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Game Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Family Game Night"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usTeam">Your Team Name</Label>
              <Input
                id="usTeam"
                value={usTeamName}
                onChange={(e) => setUsTeamName(e.target.value)}
                placeholder="Us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="themTeam">Opponent Team Name</Label>
              <Input
                id="themTeam"
                value={themTeamName}
                onChange={(e) => setThemTeamName(e.target.value)}
                placeholder="Them"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetScore">Target Score</Label>
            <Select value={targetScore} onValueChange={setTargetScore}>
              <SelectTrigger>
                <SelectValue placeholder="Select target score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="500">500 points</SelectItem>
                <SelectItem value="1000">1000 points</SelectItem>
                <SelectItem value="1500">1500 points</SelectItem>
                <SelectItem value="2000">2000 points</SelectItem>
                <SelectItem value="2500">2500 points</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <CardFooter className="flex justify-center pt-4 px-0">
            <Button type="submit" className="w-full">Create Game</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewGameForm;
