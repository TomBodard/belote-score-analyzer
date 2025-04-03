
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { BeloteContract, Team, TrumpCard } from "@/types/belote";
import { addRoundToGame } from "@/services/storageService";
import { calculateRoundScore, getTrumpSymbol, getTrumpColorClass } from "@/utils/beloteUtils";
import { toast } from "sonner";

interface NewRoundFormProps {
  gameId: string;
  usTeamName: string;
  themTeamName: string;
  onRoundAdded: () => void;
}

const NewRoundForm = ({ gameId, usTeamName, themTeamName, onRoundAdded }: NewRoundFormProps) => {
  const [bidTeam, setBidTeam] = useState<Team>("us");
  const [bidContract, setBidContract] = useState<BeloteContract>("80");
  const [trumpCard, setTrumpCard] = useState<TrumpCard>("hearts");
  const [pointsMode, setPointsMode] = useState<"manual" | "calculator">("manual");
  const [usPoints, setUsPoints] = useState<number>(0);
  const [themPoints, setThemPoints] = useState<number>(0);
  const [beloteTeam, setBeloteTeam] = useState<Team | undefined>(undefined);
  const [hasBelote, setHasBelote] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [bidSuccess, setBidSuccess] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Use the util function to calculate scores based on the contract and points
      const { usScore, themScore } = calculateRoundScore(
        bidTeam,
        bidContract,
        trumpCard,
        usPoints,
        themPoints,
        hasBelote ? beloteTeam : undefined
      );
      
      // Add the round to the game
      addRoundToGame(gameId, {
        bidTeam,
        bidContract,
        trumpCard,
        bidSuccess,
        usPoints: usScore,
        themPoints: themScore,
        beloteTeam: hasBelote ? beloteTeam : undefined,
        notes: notes.trim() || undefined
      });
      
      // Reset form
      setBidTeam("us");
      setBidContract("80");
      setTrumpCard("hearts");
      setPointsMode("manual");
      setUsPoints(0);
      setThemPoints(0);
      setBeloteTeam(undefined);
      setHasBelote(false);
      setNotes("");
      setBidSuccess(true);
      
      toast.success("Round added successfully!");
      onRoundAdded();
    } catch (error) {
      console.error("Error adding round:", error);
      toast.error("Failed to add round. Please try again.");
    }
  };

  const handlePointsChange = (team: Team, value: string) => {
    const points = parseInt(value, 10);
    if (!isNaN(points) && points >= 0) {
      if (team === "us") {
        setUsPoints(points);
      } else {
        setThemPoints(points);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Add New Round</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bidTeam">Bidding Team</Label>
              <Select value={bidTeam} onValueChange={(value) => setBidTeam(value as Team)}>
                <SelectTrigger id="bidTeam">
                  <SelectValue placeholder="Select bidding team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">{usTeamName}</SelectItem>
                  <SelectItem value="them">{themTeamName}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bidContract">Contract</Label>
              <Select value={bidContract} onValueChange={(value) => setBidContract(value as BeloteContract)}>
                <SelectTrigger id="bidContract">
                  <SelectValue placeholder="Select contract" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80">80</SelectItem>
                  <SelectItem value="90">90</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="110">110</SelectItem>
                  <SelectItem value="120">120</SelectItem>
                  <SelectItem value="130">130</SelectItem>
                  <SelectItem value="140">140</SelectItem>
                  <SelectItem value="150">150</SelectItem>
                  <SelectItem value="160">160</SelectItem>
                  <SelectItem value="capot">Capot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trumpCard">Trump Card</Label>
            <div className="grid grid-cols-6 gap-2">
              {(["hearts", "diamonds", "clubs", "spades", "no-trump", "all-trump"] as TrumpCard[]).map((trump) => (
                <Button
                  key={trump}
                  type="button"
                  variant={trumpCard === trump ? "default" : "outline"}
                  className={`${trumpCard === trump ? "bg-primary" : ""} ${getTrumpColorClass(trump)}`}
                  onClick={() => setTrumpCard(trump)}
                >
                  <span className="text-lg">{getTrumpSymbol(trump)}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <Tabs value={pointsMode} onValueChange={(value) => setPointsMode(value as "manual" | "calculator")}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="manual">Manual Scoring</TabsTrigger>
              <TabsTrigger value="calculator">Point Calculator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usPoints">{usTeamName} Points</Label>
                  <Input
                    id="usPoints"
                    type="number"
                    min="0"
                    value={usPoints}
                    onChange={(e) => handlePointsChange("us", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="themPoints">{themTeamName} Points</Label>
                  <Input
                    id="themPoints"
                    type="number"
                    min="0"
                    value={themPoints}
                    onChange={(e) => handlePointsChange("them", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bidSuccess">Bid Successful?</Label>
                  <Switch
                    id="bidSuccess"
                    checked={bidSuccess}
                    onCheckedChange={setBidSuccess}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="calculator" className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Coming soon! For now, please use manual scoring.
              </p>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="hasBelote">Belote & Rebelote</Label>
              <Switch
                id="hasBelote"
                checked={hasBelote}
                onCheckedChange={setHasBelote}
              />
            </div>
            
            {hasBelote && (
              <div className="mt-2">
                <Label htmlFor="beloteTeam">Team with Belote</Label>
                <Select value={beloteTeam} onValueChange={(value) => setBeloteTeam(value as Team)}>
                  <SelectTrigger id="beloteTeam">
                    <SelectValue placeholder="Select team with Belote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">{usTeamName}</SelectItem>
                    <SelectItem value="them">{themTeamName}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this round..."
              rows={2}
            />
          </div>
          
          <Button type="submit" className="w-full">Add Round</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewRoundForm;
