"use client";

import Header from "@/components/Header";
import { DataTable } from "@/components/ui/data-table";
import { Team, useGetTeamsQuery } from "@/state/api";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

const columns: ColumnDef<Team>[] = [
  { accessorKey: "id", header: "Team ID" },
  { accessorKey: "teamName", header: "Team Name" },
  { accessorKey: "productOwnerUsername", header: "Product Owner" },
  { accessorKey: "projectManagerUsername", header: "Project Manager" },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !teams) return <div className="p-8">Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <DataTable columns={columns} data={teams} pageSize={10} />
    </div>
  );
};

export default Teams;
