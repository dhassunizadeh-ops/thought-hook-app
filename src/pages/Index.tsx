import { useState, useEffect } from "react";
import { Plus, Search, FileText, Tag, Settings, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Note {
  id: number;
  title: string;
  timestamp: Date;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 2, title: "Buy coffee beans", timestamp: new Date(Date.now() - 3600000) },
    { id: 1, title: "Call mom this weekend", timestamp: new Date(Date.now() - 7200000) },
  ]);
  const [streak, setStreak] = useState(3);
  const [showToast, setShowToast] = useState(false);
  const [noteCounter, setNoteCounter] = useState(3);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [snoozeNotifications, setSnoozeNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [showTimeSpent, setShowTimeSpent] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);

  const addNote = () => {
    if (!newNoteText.trim()) return;
    
    const newNote: Note = {
      id: noteCounter,
      title: newNoteText.trim(),
      timestamp: new Date(),
    };
    setNotes([newNote, ...notes]);
    setNoteCounter(noteCounter + 1);
    setStreak(streak + 1);
    setShowToast(true);
    setIsSheetOpen(false);
    setNewNoteText("");
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Keyboard shortcut: N to add new note
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        if (!isSheetOpen && !isSettingsOpen && document.activeElement?.tagName !== 'INPUT') {
          setIsSheetOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSheetOpen, isSettingsOpen]);

  // Timer countdown
  useEffect(() => {
    if (timerSeconds !== null && timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds(prev => prev !== null && prev > 0 ? prev - 1 : null);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerSeconds]);

  const resetDemo = () => {
    setNotes([]);
    setStreak(0);
    setNoteCounter(1);
  };

  const startTimer = () => {
    setTimerSeconds(120); // 2 minutes = 120 seconds
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* iPhone-style container */}
        <div className="w-full max-w-[390px] h-[844px] bg-card rounded-[3rem] shadow-2xl overflow-hidden border-8 border-[#1f1f1f] relative">
          {/* Status bar simulation */}
          <div className="h-11 bg-card flex items-center justify-between px-8 text-xs font-semibold">
            <span>9:41</span>
            <div className="flex gap-1 items-center">
              <div className="w-4 h-3 border border-foreground rounded-sm" />
              <div className="w-6 h-3 border border-foreground rounded-sm" />
            </div>
          </div>

          {/* Main content */}
          <div className="h-[calc(100%-44px)] flex flex-col bg-background">
            {/* Header */}
            <header className="px-4 pt-2 pb-3 bg-card border-b border-border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-foreground">Notes</h1>
                    <button
                      onClick={resetDemo}
                      className="text-xs text-muted-foreground hover:text-foreground underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--ios-blue))] focus-visible:outline-none rounded"
                      aria-label="Reset demo"
                    >
                      <RotateCcw className="w-3 h-3 inline mr-1" />
                      Reset demo
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Streak: <span className="font-semibold text-[hsl(var(--ios-blue))]">{streak} days</span>
                  </p>
                </div>
                <Button
                  onClick={() => setIsSheetOpen(true)}
                  size="sm"
                  className="bg-[hsl(var(--ios-blue))] hover:bg-[hsl(var(--ios-blue))]/90 text-primary-foreground font-semibold rounded-full h-10 px-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ios-blue))]"
                  aria-label="Add a new note"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  New
                </Button>
              </div>
            </header>

            {/* Search bar */}
            <div className="px-4 py-3 bg-card border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-0 h-10 rounded-xl text-base focus-visible:ring-[hsl(var(--ios-blue))]"
                />
              </div>
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {filteredNotes.length === 0 && searchQuery === "" ? (
                <div className="bg-card border border-border rounded-xl p-6 text-center animate-fade-in">
                  <p className="text-muted-foreground">No notes yet. Tap <span className="font-semibold text-[hsl(var(--ios-blue))]">+ New</span> to add your first note.</p>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-6 text-center animate-fade-in">
                  <p className="text-muted-foreground">No notes match your search.</p>
                </div>
              ) : (
                filteredNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="bg-card border border-border rounded-xl p-4 mb-2 hover:bg-secondary/50 transition-colors cursor-pointer animate-fade-in focus-visible:ring-2 focus-visible:ring-[hsl(var(--ios-blue))] focus-visible:outline-none"
                    style={{ animationDelay: `${index * 50}ms` }}
                    tabIndex={0}
                  >
                    <h3 className="font-semibold text-foreground mb-1">{note.title}</h3>
                    <p className="text-xs text-muted-foreground">{formatTime(note.timestamp)}</p>
                  </div>
                ))
              )}
            </div>

            {/* Hook Loop Strip */}
            <div className="px-4 py-3 bg-secondary/30 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Hook Loop
                </p>
                {timerSeconds !== null && timerSeconds > 0 && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-[hsl(var(--ios-blue))]">
                    <Timer className="w-3 h-3" />
                    {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                  </div>
                )}
                {(timerSeconds === null || timerSeconds === 0) && (
                  <button
                    onClick={startTimer}
                    className="text-[10px] font-semibold text-[hsl(var(--ios-blue))] hover:underline focus-visible:ring-1 focus-visible:ring-[hsl(var(--ios-blue))] focus-visible:outline-none rounded px-1"
                  >
                    Start 2-minute timer
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Trigger", desc: "Streak visible" },
                  { label: "Action", desc: "+ New tap" },
                  { label: "Reward", desc: "Toast & +1" },
                  { label: "Investment", desc: "Note saved" },
                ].map((step) => (
                  <div key={step.label} className="bg-card rounded-lg p-2 border border-border">
                    <p className="text-[10px] font-bold text-foreground mb-0.5">{step.label}</p>
                    <p className="text-[8px] text-muted-foreground leading-tight">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="bg-card border-t border-border px-8 py-2 pb-6">
              <div className="flex justify-around items-center">
                <button className="flex flex-col items-center gap-1 text-[hsl(var(--ios-blue))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--ios-blue))] focus-visible:outline-none rounded">
                  <FileText className="w-6 h-6" />
                  <span className="text-[10px] font-semibold">Notes</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-[hsl(var(--ios-blue))] focus-visible:outline-none rounded">
                  <Tag className="w-6 h-6" />
                  <span className="text-[10px]">Tags</span>
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-[hsl(var(--ios-blue))] focus-visible:outline-none rounded"
                >
                  <Settings className="w-6 h-6" />
                  <span className="text-[10px]">Settings</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Educational Badges */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="absolute top-24 right-4 w-8 h-8 rounded-full bg-[hsl(var(--badge-krug))] text-white font-bold text-sm shadow-lg hover:scale-110 transition-transform z-10 flex items-center justify-center">
                1
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px] bg-card border-2 border-[hsl(var(--badge-krug))]">
              <p className="font-bold text-[hsl(var(--badge-krug))] mb-1">Krug</p>
              <p className="text-xs">One obvious primary action (+ New)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="absolute top-[140px] right-4 w-8 h-8 rounded-full bg-[hsl(var(--badge-norman))] text-white font-bold text-sm shadow-lg hover:scale-110 transition-transform z-10 flex items-center justify-center">
                2
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px] bg-card border-2 border-[hsl(var(--badge-norman))]">
              <p className="font-bold text-[hsl(var(--badge-norman))] mb-1">Norman</p>
              <p className="text-xs">Signifiers & mapping; immediate feedback</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="absolute top-[188px] right-4 w-8 h-8 rounded-full bg-[hsl(var(--badge-eyal))] text-white font-bold text-sm shadow-lg hover:scale-110 transition-transform z-10 flex items-center justify-center">
                3
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px] bg-card border-2 border-[hsl(var(--badge-eyal))]">
              <p className="font-bold text-[hsl(var(--badge-eyal))] mb-1">Eyal</p>
              <p className="text-xs">Variable reward (toast) + Investment (streak)</p>
            </TooltipContent>
          </Tooltip>

          {/* Toast Notification */}
          {showToast && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-2xl shadow-2xl animate-toast-in z-20">
              <p className="text-sm font-semibold">Note saved!</p>
            </div>
          )}
        </div>

        {/* New Note Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-[2rem] border-t-8 border-[#1f1f1f]">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">New Note</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <Input
                placeholder="Type your note here..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                autoFocus
                className="text-base h-12"
              />
              <Button
                onClick={addNote}
                className="w-full bg-[hsl(var(--ios-blue))] hover:bg-[hsl(var(--ios-blue))]/90 h-12 text-base font-semibold"
                disabled={!newNoteText.trim()}
              >
                Save Note
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Settings Sheet */}
        <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <SheetContent side="bottom" className="rounded-t-[2rem] border-t-8 border-[#1f1f1f]">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                You control prompts and rewards.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="snooze" className="text-base">Snooze notifications</Label>
                <Switch
                  id="snooze"
                  checked={snoozeNotifications}
                  onCheckedChange={setSnoozeNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="digest" className="text-base">Weekly digest only</Label>
                <Switch
                  id="digest"
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="time" className="text-base">Show time spent</Label>
                <Switch
                  id="time"
                  checked={showTimeSpent}
                  onCheckedChange={setShowTimeSpent}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
};

export default Index;
