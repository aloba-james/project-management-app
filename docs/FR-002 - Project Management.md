# Cursor Implementation Guide
# Feature: FR-002 - Project Management
# Product: Flox
# Version: 1.0

---

# Vision

A Project is the primary execution container inside a Workspace.

Projects organize work.

Projects contain Objects.

Projects contain AI Memory.

Projects contain Files.

Projects contain Tasks.

Projects contain Knowledge.

Projects contain Meetings.

Projects contain Automations.

Projects contain Agents.

Projects are living workspaces.

---

# Philosophy

Projects are not folders.

Projects are intelligent environments.

Every project has context.

Every project has memory.

Every project has relationships.

The AI understands the project as a whole.

---

# Project Structure

Workspace

↓

Projects

↓

Folders

↓

Files

↓

Tasks

↓

Knowledge

↓

Meetings

↓

Templates

↓

Objects

---

# Responsibilities

Project Service must support

Create Project

Update Project

Archive Project

Delete Project

Restore Project

Clone Project

Duplicate Project

Import Project

Export Project

Search Projects

Project Dashboard

Project Settings

Project Activity

---

# Methods of Creation

Manual

AI Prompt

Template

Import

Blueprint

API

Automation

---

# AI Project Creation

Example

User

Create a Hospital Implementation Project

Brain

↓

Planner

↓

Execution Plan

↓

Suggested Project Blueprint

↓

Approval

↓

Project Created

↓

Objects Generated

AI should never create an empty project by default.

---

# Project Properties

id

workspaceId

name

slug

description

status

priority

visibility

ownerId

projectType

industry

budget

currency

startDate

dueDate

completedDate

progress

color

icon

coverImage

metadata

createdAt

updatedAt

deletedAt

---

# Project Status

Draft

Planning

Active

On Hold

Blocked

Completed

Cancelled

Archived

Deleted

---

# Project Types

Software

Marketing

Research

Healthcare

Sales

Finance

HR

Construction

Legal

Education

Operations

Startup

Personal

Custom

---

# Visibility

Private

Workspace

Public Link

Restricted

---

# Default Modules

Every project automatically supports

Overview

Files

Folders

Tasks

Knowledge

Meetings

Activity

Templates

Members

Timeline

AI

Settings

Users can disable modules.

---

# Project Overview

Display

Name

Description

Status

Progress

Owner

Members

Health

Budget

Timeline

Recent Activity

AI Summary

Goals

Milestones

Risks

---

# Project Dashboard Widgets

Recent Files

Recent Tasks

Upcoming Meetings

Timeline

Calendar

Activity Feed

AI Insights

Project Health

Storage Usage

Automation Status

Widgets must be configurable.

---

# AI Summary

Every project stores

aiSummary

Automatically generated.

Example

"This project manages the implementation of Purple Plus HMS at St. Luke's Hospital. Current progress is 38%. Outstanding tasks relate to pharmacy integration and user training."

Updated after significant changes.

---

# Project Blueprint

Blueprints define starter structures.

Example

Software Project

Folders

/src

/docs

/design

/api

/tests

Tasks

Architecture

Database

Authentication

Deployment

Knowledge

Requirements

Architecture Decisions

Meeting Notes

Templates

PRD

System Design

API Spec

README

---

Healthcare Implementation

Folders

Contracts

Training

Deployment

Configuration

Support

Templates

Proposal

Implementation Plan

Go-Live Checklist

Risk Register

Training Manual

Knowledge

Hospital Contacts

Meeting Notes

Requirements

---

# Project Relationships

Projects may relate to

Workspace

Files

Tasks

Templates

Knowledge

Meetings

Companies

Customers

Repositories

Automations

Agents

Everything is linked through Object IDs.

---

# APIs

POST

/api/v1/projects

GET

/api/v1/projects

GET

/api/v1/projects/{id}

PATCH

/api/v1/projects/{id}

DELETE

/api/v1/projects/{id}

POST

/api/v1/projects/{id}/archive

POST

/api/v1/projects/{id}/restore

POST

/api/v1/projects/{id}/duplicate

POST

/api/v1/projects/{id}/clone

---

# Search

Support

Keyword

Semantic

AI

Status

Owner

Member

Date

Tag

Project Type

Progress

Natural language

Example

"Show active healthcare projects due this month."

---

# Events

ProjectCreated

ProjectUpdated

ProjectArchived

ProjectDeleted

ProjectCompleted

ProjectMemberAdded

ProjectMemberRemoved

ProjectBlueprintApplied

---

# Permissions

Owner

Admin

Manager

Editor

Viewer

Guest

Permissions inherit from Workspace unless overridden.

---

# Notifications

Notify when

Project Created

Project Updated

Member Added

Due Date Changed

Project Completed

Project Archived

---

# Analytics

Track

Projects Created

Completion Rate

Average Duration

Budget Variance

AI Usage

Storage

Task Velocity

Member Activity

Project Health

---

# Future Compatibility

Projects must support

AI Agents

Automations

MCP

GitHub Integration

Google Drive

Microsoft 365

Slack

Teams

Calendars

Enterprise Workflows

Marketplace Extensions

---

# Engineering Principles

A Project is not a collection of files.

A Project is a living execution environment.

Every Project has

Context

Memory

Knowledge

Relationships

AI

Automation

History

The AI should understand the Project as a complete system, not as isolated documents.

All future modules must extend the Project rather than exist independently.