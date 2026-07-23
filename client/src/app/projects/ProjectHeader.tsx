"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Filter,
  Grid3X3,
  List,
  PlusSquare,
  Share2,
  Table,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import ModalNewProject from "./ModalNewProject";
import ModalProjectTeams from "./ModalProjectTeams";
import { useGetProjectsQuery } from "@/state/api";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  projectId?: string;
};

const ProjectHeader = ({ activeTab, setActiveTab, projectId }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [isTeamsModalOpen, setIsTeamsModalOpen] = useState(false);
  const { data: projects } = useGetProjectsQuery();
  const project = projects?.find(
    (item) => String(item.id) === String(projectId),
  );
  const projectName = project?.name ?? "Project";
  const teamCount = project?.projectTeams?.length ?? 0;

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      {projectId && (
        <ModalProjectTeams
          projectId={Number(projectId)}
          isOpen={isTeamsModalOpen}
          onClose={() => setIsTeamsModalOpen(false)}
        />
      )}
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-4">
        <Header
          name={projectName}
          buttonComponent={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTeamsModalOpen(true)}
              >
                <Users className="h-4 w-4" />
                Teams{teamCount > 0 ? ` (${teamCount})` : ""}
              </Button>
              <Button
                type="button"
                onClick={() => setIsModalNewProjectOpen(true)}
              >
                <PlusSquare className="h-4 w-4" />
                New Boards
              </Button>
            </div>
          }
        />
      </div>

      <div className="flex flex-wrap-reverse items-center gap-2 border-y py-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="Board" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              Board
            </TabsTrigger>
            <TabsTrigger value="List" className="gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="Timeline" className="gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="Table" className="gap-2">
              <Table className="h-4 w-4" />
              Table
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" type="button">
            <Filter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" type="button">
            <Share2 className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Grid3X3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Task..."
              className="w-44 pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
