import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Check, X, Pencil } from "lucide-react";

interface PersonalizationInputProps {
  userName: string;
  onUpdateName: (name: string) => void;
}

export default function PersonalizationInput({ userName, onUpdateName }: PersonalizationInputProps) {
  const [isEditing, setIsEditing] = useState(!userName);
  const [inputValue, setInputValue] = useState(userName);

  const handleSave = () => {
    onUpdateName(inputValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(userName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isEditing && userName) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <User className="w-4 h-4" />
        <span className="max-w-[100px] truncate">{userName}</span>
        <Pencil className="w-3 h-3" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <User className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Your name"
          className="h-8 pl-8 pr-2 w-32 text-sm rounded-full bg-muted/50 border-0"
          autoFocus
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSave}
        className="h-7 w-7 rounded-full text-clarity hover:text-clarity hover:bg-clarity/10"
        aria-label="Save name"
      >
        <Check className="w-3.5 h-3.5" />
      </Button>
      {userName && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="h-7 w-7 rounded-full text-muted-foreground"
          aria-label="Cancel"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}
