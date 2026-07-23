"use client";

import Header from "@/components/Header";
import { DataTable } from "@/components/ui/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, useGetUsersQuery } from "@/state/api";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "userId",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "profilePictureUrl",
    header: "Profile",
    cell: ({ row }) => {
      const value = row.original.profilePictureUrl;
      if (!value) return null;
      const src = String(value).startsWith("http") ? value : `/${value}`;
      return (
        <Avatar className="h-9 w-9">
          <AvatarImage src={src} alt={row.original.username} />
          <AvatarFallback>
            {row.original.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !users) return <div className="p-8">Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <DataTable columns={columns} data={users} pageSize={10} />
    </div>
  );
};

export default Users;
