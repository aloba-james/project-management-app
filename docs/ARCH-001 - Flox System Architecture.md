# Cursor Implementation Guide
# Architecture: ARCH-001 - Flox System Architecture
# Product: Flox
# Version: 1.0

---

# Vision

Flox is not a project management application.

Flox is an AI-native Workspace Operating System.

The architecture must support millions of workspaces,
billions of objects,
thousands of AI agents,
and future AI models without major redesign.

Every module must be loosely coupled.

Every capability must be replaceable.

Every service must communicate through well-defined interfaces.

---

# Core Architecture

                Browser
                    │
                    ▼
            Next.js Application
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
    API Layer   Realtime   Authentication
         │
         ▼
    Flox Brain Gateway
         │
 ┌───────┼────────────┐
 ▼       ▼            ▼
Planner Context   Agent Router
         │
         ▼
 Execution Engine
         │
 ┌───────┼────────────┐
 ▼       ▼            ▼
 Tool Hub Knowledge Graph Event Bus
         │
         ▼
 Database + Object Storage

---

# Major Services

Authentication

Workspace Service

Object Service

Project Service

Task Service

File Service

Template Service

Knowledge Service

Prompt Service

Planner

Brain

Agent Router

Execution Engine

Tool Hub

Search

Notifications

Automation

Audit

Analytics

Billing

Each service owns its domain.

Never bypass service boundaries.

---

# Core Layers

Presentation Layer

Application Layer

AI Layer

Domain Layer

Infrastructure Layer

Persistence Layer

---

# Presentation Layer

Next.js

React

Tailwind

shadcn/ui

TanStack Query

Zustand

Presentation layer contains no business logic.

---

# Application Layer

API Routes

Validation

Authorization

Request orchestration

DTO mapping

No AI logic.

No database logic.

---

# Domain Layer

Contains

Workspace

Projects

Files

Tasks

Templates

Knowledge

Rules

Permissions

Business logic lives here.

---

# AI Layer

Brain

Planner

Context Engine

Memory

Agent Router

Prompt Interpreter

Model Router

Execution Engine

No UI dependencies.

---

# Infrastructure Layer

Database

Redis

Storage

Queues

Message Bus

Email

External APIs

MCP

---

# Persistence Layer

PostgreSQL

Vector Database

Object Storage

Cache

Search Index

Audit Storage

---

# Storage Strategy

Relational Data

↓

PostgreSQL

Embeddings

↓

Vector Database

Files

↓

S3 Compatible Storage

Cache

↓

Redis

Search

↓

OpenSearch

---

# Communication

Preferred

Internal Service Calls

Events

Queues

WebSockets

Avoid

Direct database access
between modules.

---

# Event Bus

Every major action emits events.

WorkspaceCreated

ProjectCreated

ObjectCreated

PromptExecuted

ExecutionStarted

ExecutionCompleted

TaskAssigned

NotificationSent

Events must be immutable.

---

# Object Storage

Everything is an Object.

Workspace

Project

Task

File

Meeting

Template

Knowledge

Prompt

Workflow

Automation

Every service references Object IDs.

---

# Knowledge Graph

Every object becomes a node.

Relationships are edges.

Example

Proposal

↓

references

↓

Budget

↓

belongs_to

↓

Project

↓

owned_by

↓

Workspace

Search and AI traverse the graph.

---

# Context Engine

Collects

Workspace

Current Project

Selected Objects

Templates

Knowledge

Recent Activity

Preferences

Returns one unified context.

---

# Planner

Transforms goals into plans.

Planner never executes.

---

# Execution Engine

Executes approved plans.

Tracks progress.

Supports retries.

Supports long-running jobs.

---

# Agent Router

Chooses

Proposal Agent

Developer Agent

Research Agent

Finance Agent

Meeting Agent

Legal Agent

Multiple agents may collaborate.

---

# Tool Hub

All external actions happen here.

Examples

Read File

Create Folder

Generate Word

Generate Excel

Git Commit

Deploy

Send Email

MCP Tool

Every tool implements a common interface.

---

# Model Router

Supports

OpenAI

Anthropic

Gemini

Grok

Mistral

DeepSeek

Ollama

Enterprise Models

Switch models without changing business logic.

---

# Search

Universal Search.

Searches every Object.

Supports

Keyword

Semantic

Hybrid

Relationship traversal

---

# Security

Workspace isolation

Object permissions

Encryption

Audit

Secrets management

Rate limiting

Approval workflows

Never expose one workspace to another.

---

# Multi-Tenancy

Workspace is the tenant boundary.

Every query must include Workspace ID.

No exceptions.

---

# Observability

Logs

Metrics

Tracing

Execution history

Agent performance

Model costs

Prompt analytics

---

# Deployment

Frontend

Vercel

Backend

Docker

Kubernetes

Database

Managed PostgreSQL

Storage

S3 Compatible

Redis

Managed Redis

Future deployment should support

Cloud

On-Premise

Hybrid

---

# Engineering Principles

1. Everything belongs to a Workspace.

2. Everything is an Object.

3. Every Object belongs to the Knowledge Graph.

4. Every AI request goes through the Brain.

5. Every Brain request goes through the Planner.

6. Every execution is observable.

7. Every action emits events.

8. Every external capability is a Tool.

9. Every AI provider is an Adapter.

10. Never hardcode integrations.

Design every module as if it will support one million workspaces.