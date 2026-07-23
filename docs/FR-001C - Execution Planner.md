# Cursor Implementation Guide
# Feature: FR-001C - Execution Planner
# Product: Flox
# Version: 1.0

---

# Vision

The Execution Planner is responsible for converting a user's goal into an executable plan.

The planner never performs work.

It only decides HOW work should be performed.

The planner is invoked before every AI action.

No AI execution may bypass the planner.

---

# Core Principle

Prompt

↓

Goal

↓

Execution Plan

↓

Validation

↓

Approval (optional)

↓

Execution Engine

---

# Responsibilities

The planner must

Understand intent

Determine desired outcome

Break work into steps

Estimate complexity

Estimate execution time

Estimate cost

Identify dependencies

Identify required tools

Identify required templates

Identify required permissions

Select agents

Produce execution plan

---

# Inputs

Prompt

Workspace

Current Project

Current Folder

Knowledge Graph

Templates

User Preferences

Company Policies

Current Files

Conversation History

Selected Objects

---

# Outputs

Execution Plan

Execution Summary

Required Objects

Required Agents

Required Models

Required Tools

Estimated Cost

Estimated Duration

Approval Requirement

---

# Execution Plan Structure

Execution Plan

id

goal

summary

complexity

estimatedDuration

estimatedTokens

estimatedCost

status

steps

dependencies

warnings

approvalRequired

---

# Step Structure

Each execution plan contains steps.

Fields

id

order

title

description

agent

tool

model

status

estimatedTime

estimatedCost

retryCount

dependsOn

outputObjects

---

# Complexity Levels

Simple

Medium

Complex

Enterprise

Massive

---

# Planner Strategies

Single Step

Multi Step

Parallel

Sequential

Conditional

Hybrid

---

# Example

Prompt

Create proposal for ABC Hospital.

Planner

Step 1

Find company proposal template

Step 2

Find company profile

Step 3

Find pricing

Step 4

Generate proposal

Step 5

Generate implementation timeline

Step 6

Save documents

Step 7

Link project

Step 8

Generate summary

---

# Another Example

Prompt

Build an ecommerce startup.

Planner

Create Workspace

↓

Create Projects

↓

Generate Business Plan

↓

Generate Financial Model

↓

Generate Pitch Deck

↓

Generate Website

↓

Generate Database

↓

Generate Backend

↓

Generate Frontend

↓

Generate Roadmap

↓

Assign Tasks

This is not one AI response.

This is an execution plan.

---

# Dependency Engine

Planner must understand dependencies.

Example

Cannot generate deployment guide

until

System Architecture exists.

Cannot create invoices

until

Customer exists.

Cannot deploy application

until

Repository exists.

---

# Tool Discovery

Planner determines tools.

Example

Generate Word

↓

Word Tool

Generate Spreadsheet

↓

Excel Tool

Generate Image

↓

Image Generator

Generate Website

↓

Code Generator

Deploy

↓

Deployment Tool

---

# Model Selection

Planner recommends model.

Examples

Creative Writing

Claude

Coding

GPT / DeepSeek

Research

Gemini

Image

Image Generator

Local

Ollama

Planner does not call models.

Planner only recommends.

---

# Approval Rules

Planner determines whether approval is required.

Examples

Delete Workspace

Approval Required

Send Email

Approval Required

Create File

No Approval

Update README

No Approval

Charge Credit Card

Approval Required

---

# Retry Policy

Each failed step

Retry

Maximum

3 Times

Escalate if still failing.

---

# Events

Planner publishes

PlanCreated

PlanUpdated

PlanApproved

PlanRejected

PlanStarted

PlanCompleted

PlanFailed

---

# Storage

Execution Plans must be persisted.

Users should be able to

View

Resume

Cancel

Replay

Duplicate

Execution plans.

---

# APIs

POST

/api/v1/planner/create

GET

/api/v1/planner/{id}

POST

/api/v1/planner/{id}/approve

POST

/api/v1/planner/{id}/cancel

POST

/api/v1/planner/{id}/resume

---

# UI

Execution Preview

Goal

Estimated Time

Estimated Cost

Steps

Warnings

Tools

Agents

Models

Approve Button

Cancel Button

---

# Future Compatibility

Planner must support

Multi-agent execution

Long-running workflows

Background execution

Scheduling

Recurring plans

MCP tools

External APIs

Enterprise approvals

---

# Engineering Principle

Never let AI "just generate."

Every meaningful request should first become an execution plan.

Planning is the foundation of reliable AI systems.

Execution without planning is unpredictable.

Execution with planning is observable, auditable, resumable, and trustworthy.