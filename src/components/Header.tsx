
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { PlusCircle, Home, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="border-b py-4">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-belote-primary text-white h-8 w-8 rounded-full flex items-center justify-center">
            <span className="font-bold">B</span>
          </div>
          <h1 className="text-xl font-bold">Belote Score Analyzer</h1>
        </Link>
        
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
          )}
          
          <Button size="sm" asChild>
            <Link to="/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Game
            </Link>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Belote Score Analyzer</DialogTitle>
                <DialogDescription>
                  Track and analyze your Belote card games
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  Belote Score Analyzer helps you track scores in your Belote games, analyze performance, and maintain game history.
                </p>
                <p>
                  Features:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Track points for both teams</li>
                  <li>Record contracts, bids, and trumps</li>
                  <li>View statistics and performance trends</li>
                  <li>All data is stored locally on your device</li>
                </ul>
                <p className="text-sm text-muted-foreground pt-4">
                  Version 1.0.0 • Created with ❤️
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
