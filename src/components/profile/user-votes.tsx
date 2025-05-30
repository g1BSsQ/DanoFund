import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Vote {
  id: string;
  proposal: {
    id: string;
    title: string;
  };
  fund: {
    id: string;
    name: string;
  };
  vote: "for" | "against";
  date: string;
}

const votes: Vote[] = [
];

export function UserVotes() {
  return (
    <div className="space-y-4">
      {votes.map((vote) => (
        <div key={vote.id} className="border rounded-lg p-4 bg-white dark:bg-gray-950">
          <div className="flex items-center gap-2 mb-2">
            {vote.vote === "for" ? (
              <ThumbsUp className="h-4 w-4 text-green-500" />
            ) : (
              <ThumbsDown className="h-4 w-4 text-red-500" />
            )}
            <h3 className="font-medium">{vote.proposal.title}</h3>
            <Badge variant="outline" className={
              vote.vote === "for" 
                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
                : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
            }>
              {vote.vote === "for" ? "Ủng hộ" : "Phản đối"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <Badge variant="secondary">{vote.fund.name}</Badge>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{new Date(vote.date).toLocaleDateString('vi-VN')}</span>
              <Link href={`/funds/${vote.fund.id}/proposals/${vote.proposal.id}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  Chi tiết
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}