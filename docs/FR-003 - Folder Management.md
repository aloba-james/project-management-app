# Cursor Implementation Guide
# Feature: FR-003 - Folder Management
# Product: Flox
# Version: 1.0

---

# Vision

Folders are intelligent organizational containers.

They are not simply directories.

A Folder has

AI Context

Relationships

Metadata

Permissions

Knowledge

Automation

History

Every folder exists inside a Project.

Every object belongs to a Folder.

---

# Philosophy

Traditional software

Folder

↓

Contains Files

Flox

Folder

↓

Contains Knowledge

↓

Contains Files

↓

Contains Objects

↓

Contains AI Memory

↓

Contains Workflows

↓

Contains Context

AI understands what a folder represents.

---

# Responsibilities

The Folder Service shall support

Create Folder

Rename Folder

Move Folder

Copy Folder

Duplicate Folder

Archive Folder

Restore Folder

Delete Folder

Search Folder

Favorite Folder

Share Folder

Lock Folder

Pin Folder

Color Folder

Icon Folder

---

# Methods of Creation

Manual

AI Prompt

Project Blueprint

Workflow

Import

API

Template

Automation

---

# AI Folder Creation

Prompt

Create a Sales folder

↓

Brain

↓

Planner

↓

Folder Blueprint

↓

Folder Created

↓

Suggested Subfolders

↓

Approval

↓

Execution

AI should recommend folder structures based on intent.

---

# Folder Structure

Workspace

↓

Project

↓

Folder

↓

Folder

↓

Folder

↓

Objects

Unlimited nesting.

---

# Folder Properties

id

workspaceId

projectId

parentFolderId

name

slug

description

icon

color

status

folderType

ownerId

aiSummary

metadata

createdAt

updatedAt

deletedAt

---

# Folder Types

General

Development

Design

Marketing

Finance

Legal

HR

Research

Sales

Operations

Knowledge

Archive

Assets

Templates

Custom

---

# Folder States

Active

Archived

Locked

Hidden

Deleted

---

# Folder Metadata

Store flexible metadata.

Example

{
  "department":"Engineering",
  "client":"ABC Hospital",
  "phase":"Implementation",
  "priority":"High"
}

---

# AI Summary

Every folder stores

aiSummary

Example

"This folder contains deployment documentation, infrastructure diagrams, and Kubernetes manifests for the production environment."

Automatically regenerated when contents change.

---

# Smart Folder Suggestions

Example

Prompt

Create Marketing Folder

AI suggests

Marketing

├── Campaigns

├── Social Media

├── Brand Assets

├── Reports

├── Budget

├── Research

User may accept or modify.

---

# Folder Relationships

Folders relate to

Projects

Files

Templates

Knowledge

Tasks

Meetings

People

Companies

Repositories

Everything is connected through Object IDs.

---

# Folder Views

Tree View

Grid View

List View

Timeline View

Activity View

AI View

Recent View

---

# AI Folder View

Instead of only listing contents,

display

Summary

Purpose

Important Files

Pending Tasks

Recent Activity

Recommended Actions

Related Projects

---

# Search

Search by

Name

Description

Tags

Metadata

AI Summary

Natural Language

Example

Show folders related to pharmacy deployment.

---

# Permissions

Folder inherits Project permissions.

May override

View

Comment

Edit

Delete

Share

Move

Lock

---

# Automation

Folder events

FolderCreated

FolderMoved

FolderDeleted

FolderArchived

FolderRenamed

FolderShared

FolderLocked

Trigger workflows.

---

# APIs

POST

/api/v1/folders

GET

/api/v1/folders

GET

/api/v1/folders/{id}

PATCH

/api/v1/folders/{id}

DELETE

/api/v1/folders/{id}

POST

/api/v1/folders/{id}/archive

POST

/api/v1/folders/{id}/restore

POST

/api/v1/folders/{id}/move

POST

/api/v1/folders/{id}/duplicate

---

# Analytics

Track

Folder Count

Storage Usage

Most Accessed

Most Shared

Most Active

AI Usage

Growth

---

# Future Compatibility

Folders must support

Versioning

Templates

Knowledge Graph

MCP Resources

External Storage

Google Drive

OneDrive

Dropbox

GitHub Repositories

AI Agents

Automations

Offline Sync

---

# Engineering Principles

Folders are not storage.

Folders are context.

Every folder accumulates

Knowledge

History

Relationships

AI Memory

Automation

Context

The AI should understand the meaning of a folder, not just its path.

Folders are living containers within the Flox Workspace Operating System.