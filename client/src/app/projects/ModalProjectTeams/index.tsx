"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useAssignTeamToProjectMutation,
  useGetProjectQuery,
  useGetTeamsQuery,
  useRemoveTeamFromProjectMutation,
} from "@/state/api";
import { Trash2, Users } from "lucide-react";
import React, { useState } from "react";

type Props = {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
};

const ModalProjectTeams = ({ projectId, isOpen, onClose }: Props) => {
  const { data: project, isLoading } = useGetProjectQuery(projectId, {
    skip: !isOpen,
  });
  const { data: teams } = useGetTeamsQuery();
  const [assignTeam, { isLoading: isAssigning }] =
    useAssignTeamToProjectMutation();
  const [removeTeam, { isLoading: isRemoving }] =
    useRemoveTeamFromProjectMutation();
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const assignedTeamIds = new Set(
    project?.projectTeams?.map((pt) => pt.teamId) || [],
  );
  const availableTeams =
    teams?.filter((team) => !assignedTeamIds.has(team.id ?? team.teamId)) ||
    [];

  const handleAssign = async () => {
    if (!selectedTeamId) return;
    await assignTeam({
      projectId,
      teamId: Number(selectedTeamId),
    });
    setSelectedTeamId("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Manage Project Teams">
      {isLoading || !project ? (
        <div className="py-6 text-center text-muted-foreground">Loading...</div>
      ) : (
        <div className="mt-2 space-y-6">
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Users size={16} />
              Assigned teams
            </h3>
            {project.projectTeams && project.projectTeams.length > 0 ? (
              <div className="space-y-2">
                {project.projectTeams.map((projectTeam) => (
                  <div
                    key={projectTeam.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span className="text-sm">
                      {projectTeam.team?.teamName ||
                        `Team #${projectTeam.teamId}`}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isRemoving}
                      onClick={() =>
                        removeTeam({
                          projectId,
                          teamId: projectTeam.teamId,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No teams assigned yet.
              </p>
            )}
          </section>

          <section className="space-y-3">
            <Label htmlFor="assign-team">Assign a team</Label>
            <select
              id="assign-team"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
            >
              <option value="">Select team...</option>
              {availableTeams.map((team) => (
                <option key={team.teamId} value={team.id ?? team.teamId}>
                  {team.teamName}
                </option>
              ))}
            </select>
            <Button
              type="button"
              onClick={handleAssign}
              disabled={!selectedTeamId || isAssigning}
            >
              {isAssigning ? "Assigning..." : "Assign Team"}
            </Button>
          </section>
        </div>
      )}
    </Modal>
  );
};

export default ModalProjectTeams;
