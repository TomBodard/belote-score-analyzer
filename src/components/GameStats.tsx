
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Game, Round, Team, TrumpCard } from "@/types/belote";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getTrumpSymbol, getTrumpColorClass } from "@/utils/beloteUtils";

interface GameStatsProps {
  game: Game;
}

const GameStats = ({ game }: GameStatsProps) => {
  // No rounds, show a message
  if (game.rounds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No rounds to analyze yet. Add some rounds first!</p>
      </div>
    );
  }

  // Calculate bid statistics
  const bidStats = useMemo(() => {
    const usBids = game.rounds.filter(round => round.bidTeam === "us").length;
    const themBids = game.rounds.length - usBids;
    
    const usSuccessfulBids = game.rounds.filter(round => round.bidTeam === "us" && round.bidSuccess).length;
    const themSuccessfulBids = game.rounds.filter(round => round.bidTeam === "them" && round.bidSuccess).length;
    
    const usSuccessRate = usBids > 0 ? (usSuccessfulBids / usBids) * 100 : 0;
    const themSuccessRate = themBids > 0 ? (themSuccessfulBids / themBids) * 100 : 0;
    
    return {
      usBids,
      themBids,
      usSuccessfulBids,
      themSuccessfulBids,
      usSuccessRate: Math.round(usSuccessRate),
      themSuccessRate: Math.round(themSuccessRate),
    };
  }, [game.rounds]);

  // Calculate trump statistics
  const trumpStats = useMemo(() => {
    return Object.entries(
      game.rounds.reduce((acc, round) => {
        acc[round.trumpCard] = (acc[round.trumpCard] || 0) + 1;
        return acc;
      }, {} as Record<TrumpCard, number>)
    ).map(([trump, count]) => ({
      name: trump,
      value: count,
      symbol: getTrumpSymbol(trump as TrumpCard),
      colorClass: getTrumpColorClass(trump as TrumpCard),
    }));
  }, [game.rounds]);

  // Calculate points per round
  const pointsPerRound = useMemo(() => {
    return game.rounds.map((round, index) => ({
      name: `Round ${index + 1}`,
      [game.usTeamName]: round.usPoints,
      [game.themTeamName]: round.themPoints,
    })).reverse(); // Show oldest rounds first
  }, [game.rounds, game.usTeamName, game.themTeamName]);

  // Calculate running score
  const runningScore = useMemo(() => {
    const data = [];
    let usRunningScore = 0;
    let themRunningScore = 0;
    
    for (let i = 0; i < game.rounds.length; i++) {
      usRunningScore += game.rounds[i].usPoints;
      themRunningScore += game.rounds[i].themPoints;
      
      data.push({
        name: `Round ${i + 1}`,
        [game.usTeamName]: usRunningScore,
        [game.themTeamName]: themRunningScore,
      });
    }
    
    return data;
  }, [game.rounds, game.usTeamName, game.themTeamName]);

  const COLORS = ["#2C6E49", "#4C956C", "#8C2F39", "#D68C45", "#FEFEE3", "#666"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bid Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bids Made</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-accent rounded p-2 text-center">
                    <p className="text-xs">{game.usTeamName}</p>
                    <p className="text-xl font-bold">{bidStats.usBids}</p>
                  </div>
                  <div className="bg-accent rounded p-2 text-center">
                    <p className="text-xs">{game.themTeamName}</p>
                    <p className="text-xl font-bold">{bidStats.themBids}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-accent rounded p-2 text-center">
                    <p className="text-xs">{game.usTeamName}</p>
                    <p className="text-xl font-bold">{bidStats.usSuccessRate}%</p>
                  </div>
                  <div className="bg-accent rounded p-2 text-center">
                    <p className="text-xs">{game.themTeamName}</p>
                    <p className="text-xl font-bold">{bidStats.themSuccessRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trump Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={trumpStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ symbol }) => symbol}
                >
                  {trumpStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} rounds`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Points Per Round</CardTitle>
          <CardDescription>Points scored in each round</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pointsPerRound}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={game.usTeamName} fill="#2C6E49" />
              <Bar dataKey={game.themTeamName} fill="#8C2F39" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Running Score</CardTitle>
          <CardDescription>Cumulative score progression</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={runningScore}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={game.usTeamName} fill="#4C956C" />
              <Bar dataKey={game.themTeamName} fill="#D68C45" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameStats;
