
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Round, Team } from "@/types/belote";
import { deleteRound } from "@/services/storageService";
import { formatDate, getTrumpSymbol, getTrumpColorClass } from "@/utils/beloteUtils";
import { Trash2, Info } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RoundsTableProps {
  rounds: Round[];
  usTeamName: string;
  themTeamName: string;
  gameId: string;
  onRoundDeleted: () => void;
}

const RoundsTable = ({ rounds, usTeamName, themTeamName, gameId, onRoundDeleted }: RoundsTableProps) => {
  const [roundToDelete, setRoundToDelete] = useState<string | null>(null);

  const handleDeleteRound = (roundId: string) => {
    try {
      const updatedGame = deleteRound(gameId, roundId);
      if (updatedGame) {
        toast.success("Round deleted successfully");
        onRoundDeleted();
      } else {
        toast.error("Failed to delete round");
      }
    } catch (error) {
      console.error("Error deleting round:", error);
      toast.error("An error occurred while deleting the round");
    }
    setRoundToDelete(null);
  };

  const getTeamName = (team: Team) => {
    return team === "us" ? usTeamName : themTeamName;
  };

  if (rounds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No rounds yet. Add a round to get started!</p>
      </div>
    );
  }

  // Sort rounds by timestamp (most recent first)
  const sortedRounds = [...rounds].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Round</TableHead>
            <TableHead>Bid</TableHead>
            <TableHead className="text-center">Trump</TableHead>
            <TableHead className="text-center">{usTeamName}</TableHead>
            <TableHead className="text-center">{themTeamName}</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRounds.map((round, index) => (
            <TableRow key={round.id}>
              <TableCell className="font-medium">
                {rounds.length - index}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{getTeamName(round.bidTeam)} ({round.bidContract})</span>
                  <span className="text-xs text-muted-foreground">
                    {round.bidSuccess ? "Success" : "Failed"}
                    {round.beloteTeam && (
                      <> • Belote: {getTeamName(round.beloteTeam)}</>
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className={`text-lg ${getTrumpColorClass(round.trumpCard)}`}>
                  {getTrumpSymbol(round.trumpCard)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={round.usPoints > round.themPoints ? "default" : "outline"}>
                  {round.usPoints}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={round.themPoints > round.usPoints ? "default" : "outline"}>
                  {round.themPoints}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {round.notes && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Round Notes</DialogTitle>
                          <DialogDescription>
                            {formatDate(round.timestamp)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 p-4 bg-muted rounded-md">
                          <p>{round.notes}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  <AlertDialog open={roundToDelete === round.id} onOpenChange={(open) => !open && setRoundToDelete(null)}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setRoundToDelete(round.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Round</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this round? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteRound(round.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoundsTable;
