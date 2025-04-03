
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewGameForm from "@/components/NewGameForm";
import { PlayCards } from "lucide-react";

const NewGamePage = () => {
  return (
    <div className="container py-6 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Start a New Game</h2>
      
      <div className="grid gap-6">
        <NewGameForm />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCards className="h-5 w-5" />
              Game Rules Reminder
            </CardTitle>
            <CardDescription>
              Quick guide for Belote scoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Card Values</h3>
              <ul className="text-sm text-muted-foreground pl-5 list-disc space-y-1">
                <li>Trump Jack (Valet): 20 points</li>
                <li>Trump 9: 14 points</li>
                <li>Trump Ace: 11 points</li>
                <li>Trump 10: 10 points</li>
                <li>Trump King: 4 points</li>
                <li>Trump Queen: 3 points</li>
                <li>Trump 8: 0 points</li>
                <li>Trump 7: 0 points</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Non-Trump Values</h3>
              <ul className="text-sm text-muted-foreground pl-5 list-disc space-y-1">
                <li>Ace: 11 points</li>
                <li>10: 10 points</li>
                <li>King: 4 points</li>
                <li>Queen: 3 points</li>
                <li>Jack: 2 points</li>
                <li>9, 8, 7: 0 points</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Special Combinations</h3>
              <ul className="text-sm text-muted-foreground pl-5 list-disc space-y-1">
                <li>Belote (King and Queen of trump): 20 points</li>
                <li>Last trick: 10 points</li>
                <li>All tricks (Capot): 100 extra points</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewGamePage;
