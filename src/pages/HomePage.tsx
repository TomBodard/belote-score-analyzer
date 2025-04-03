
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GamesList from "@/components/GamesList";
import { PlusCircle, PlayCards } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="container py-6 max-w-3xl">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Belote Games</h2>
          <p className="text-muted-foreground">
            Track and analyze your Belote card games
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link to="/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Game
          </Link>
        </Button>
      </div>

      <GamesList />

      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCards className="h-5 w-5" />
            What is Belote?
          </CardTitle>
          <CardDescription>
            A popular French trick-taking card game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Belote is a 32-card, trick-taking game popular in France and other countries. It's played with four players in two partnerships, with partners sitting opposite each other. Players bid on contracts and try to take tricks with their cards, with certain cards being worth more points depending on the trump suit. The game includes special combinations like Belote and Rebelote, which award extra points.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <a href="https://en.wikipedia.org/wiki/Belote" target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomePage;
