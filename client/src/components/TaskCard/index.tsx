import { Task } from "@/state/api";
import { resolveMediaUrl } from "@/lib/media";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  task: Task;
  onClick?: (taskId: number) => void;
};

const TaskCard = ({ task, onClick }: Props) => {
  return (
    <Card
      className={onClick ? "mb-3 cursor-pointer transition-shadow hover:shadow-md" : "mb-3"}
      onClick={() => onClick?.(task.id)}
      role={onClick ? "button" : undefined}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {task.attachments && task.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.attachments.map((attachment) => (
              <div key={attachment.id} className="relative h-28 w-full sm:w-40">
                <Image
                  src={resolveMediaUrl(attachment.fileURL)}
                  alt={attachment.fileName}
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 640px) 100vw, 160px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        <p className="text-muted-foreground">
          {task.description || "No description"}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{task.status || "Not set"}</Badge>
          <Badge variant="outline">{task.priority || "Not set"}</Badge>
          {typeof task.tags === "string" &&
            task.tags.split(",").filter(Boolean).map((tag) => (
              <Badge key={tag.trim()} variant="outline">
                {tag.trim()}
              </Badge>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Start</p>
            <p>
              {task.startDate
                ? format(new Date(task.startDate), "PP")
                : "Not set"}
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Due</p>
            <p>
              {task.dueDate ? format(new Date(task.dueDate), "PP") : "Not set"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px]">
                {(task.author?.username || "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{task.author?.username || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px]">
                {(task.assignee?.username || "UA").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">
              {task.assignee?.username || "Unassigned"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
