# Cursor Implementation Guide
# Feature: FR-001B - Flox Brain
# Version: 1.0
# Product: Flox

---

# Vision

The Flox Brain is the central orchestration engine.

It is NOT an LLM.

It is NOT Chat.

It is NOT OpenAI.

It is the decision-making layer that understands user intent,
plans work, gathers context, chooses the right AI model or agent,
executes actions, and stores results.

The Brain coordinates intelligence across the platform.

---

# Core Principle

Never allow the UI to call an LLM directly.

Everything goes through the Flox Brain.

User

↓

Flox Brain

↓

Planner

↓

Context Engine

↓

Knowledge Graph

↓

Agent Router

↓

LLM

↓

Action Executor

↓

Workspace Update

---

# Responsibilities

The Brain must:

Understand intent

Retrieve context

Retrieve templates

Retrieve files

Retrieve history

Retrieve workspace memory

Choose agent

Choose model

Create execution plan

Execute

Store outputs

Update relationships

Generate summaries

Notify users

---

# Modules

brain/

planner/

context/

memory/

routing/

execution/

models/

agents/

prompts/

summaries/

tools/

---

# Brain Pipeline

Incoming Request

↓

Authentication

↓

Permission Validation

↓

Intent Classification

↓

Context Retrieval

↓

Knowledge Graph Search

↓

Template Retrieval

↓

Execution Planning

↓

Agent Selection

↓

Model Selection

↓

Tool Selection

↓

Execution

↓

Validation

↓

Storage

↓

Relationship Updates

↓

Response

---

# Intent Types

Create

Update

Delete

Search

Summarize

Generate

Translate

Explain

Research

Analyze

Automate

Schedule

Build

Deploy

Import

Export

Review

Approve

Compare

---

# Context Sources

Workspace

Project

Folder

Files

Templates

Knowledge Base

Recent Activity

Prompt History

Meetings

Tasks

Repositories

Calendar

User Preferences

Company Settings

---

# Agent Router

The Brain decides which agent performs work.

Examples

Proposal Agent

Developer Agent

Finance Agent

Research Agent

Meeting Agent

Design Agent

Legal Agent

Marketing Agent

General Agent

Multiple agents may work together.

---

# Model Router

The Brain decides which model to use.

Supported

OpenAI

Anthropic

Google Gemini

Grok

Mistral

DeepSeek

Local Ollama

Future Models

Never hardcode models.

Use adapters.

---

# Execution Plan

Every prompt generates a plan.

Example

Prompt

"Create a proposal."

Execution Plan

1 Retrieve template

2 Retrieve company profile

3 Retrieve pricing

4 Generate proposal

5 Save proposal

6 Link project

7 Generate summary

8 Notify user

The plan should exist before execution begins.

---

# Memory

The Brain stores

User preferences

Workspace preferences

Naming conventions

Writing style

Frequently used templates

Previous outputs

Common prompts

---

# Tool Layer

The Brain calls tools.

Examples

Create Folder

Create File

Update File

Read File

Generate Word

Generate Excel

Send Email

Search Objects

Commit Git

Create Meeting

Future tools should be pluggable.

---

# Safety

The Brain validates

Permissions

Workspace boundaries

Sensitive data

Dangerous operations

Confirmation-required actions

AI must never cross workspace boundaries without explicit approval.

---

# Events

The Brain publishes events.

Examples

PromptExecuted

ProjectCreated

FileGenerated

TaskCreated

ProposalCompleted

MeetingSummarized

Events are consumed by

Notifications

Automations

Audit

Analytics

---

# APIs

POST

/api/v1/brain/execute

POST

/api/v1/brain/plan

POST

/api/v1/brain/context

POST

/api/v1/brain/search

---

# Logging

Every execution stores

Prompt

Plan

Context Sources

Tools Used

Model Used

Execution Time

Token Usage

Cost

Errors

Result Objects

---

# Future Compatibility

The Brain must support

MCP

Custom AI Models

Enterprise AI

Offline Models

Private Models

Multi-agent workflows

Voice

Vision

Video

Robotics

---

# Engineering Principle

The Flox Brain never performs work directly.

It thinks.

Plans.

Delegates.

Coordinates.

Executes.

Learns.

The Brain is the operating system scheduler for AI work.

All platform intelligence flows through it.