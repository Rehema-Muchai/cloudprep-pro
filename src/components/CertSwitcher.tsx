import { Check, ChevronDown, Cloud, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COMING_SOON = [
  { name: "AWS Cloud Practitioner", code: "CLF-C02" },
  { name: "Microsoft AI Fundamentals", code: "AI-900" },
];

export function CertSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-navy-foreground/20 px-3 py-1.5 text-xs font-semibold text-navy-foreground transition hover:bg-navy-foreground/10">
        <Cloud className="h-3.5 w-3.5 text-accent" />
        <span className="hidden sm:inline">AZ-900</span>
        <span className="rounded-full bg-success/20 px-1.5 py-0.5 text-[10px] text-success">Active</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Certification track</DropdownMenuLabel>
        <DropdownMenuItem className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-primary" />
            <span>
              <span className="block text-sm font-medium">Azure Fundamentals</span>
              <span className="block text-xs text-muted-foreground">AZ-900</span>
            </span>
          </span>
          <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
            <Check className="h-3 w-3" /> Active
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {COMING_SOON.map((c) => (
          <DropdownMenuItem key={c.code} disabled className="flex items-center justify-between gap-2 opacity-60">
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>
                <span className="block text-sm font-medium">{c.name}</span>
                <span className="block text-xs text-muted-foreground">{c.code}</span>
              </span>
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Coming Soon
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
