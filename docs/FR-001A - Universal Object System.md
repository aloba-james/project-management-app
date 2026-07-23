# Cursor Implementation Guide
# Feature: FR-001A - Universal Object System
# Version: 1.0
# Product: Flox

---

# Vision

Everything inside Flox is an Object.

Files are Objects.

Folders are Objects.

Projects are Objects.

Templates are Objects.

Tasks are Objects.

Meetings are Objects.

AI Prompts are Objects.

Knowledge Articles are Objects.

People are Objects.

Companies are Objects.

Repositories are Objects.

Every Object follows the same lifecycle.

This allows AI to understand everything uniformly.

---

# Core Principle

Never build isolated tables.

Build Objects.

Specific features extend the Object.

Example

Workspace

↓

Object

↓

Project

↓

Folder

↓

File

↓

Template

↓

Task

↓

Meeting

↓

Knowledge

---

# Base Object

Every object MUST inherit these fields.

id

workspaceId

objectType

name

description

status

createdBy

updatedBy

createdAt

updatedAt

deletedAt

aiSummary

tags

metadata

---

# Supported Object Types

Workspace

Project

Folder

File

Task

Meeting

Prompt

Template

Knowledge

Person

Company

Repository

Workflow

Automation

Image

Video

Spreadsheet

Presentation

Database

Website

API

Future object types should require zero schema redesign.

---

# Object Status

Draft

Active

Archived

Deleted

Completed

In Review

Pending

Cancelled

---

# Universal Relationships

Every object can relate to another object.

Example

Proposal.docx

↓

belongsTo

↓

Project

↓

references

↓

Budget.xlsx

↓

createdFrom

↓

Prompt

↓

assignedTo

↓

User

Do NOT hardcode relationships.

Create a relationship engine.

---

# Object Relationships Table

Fields

id

workspaceId

sourceObjectId

targetObjectId

relationshipType

createdAt

Relationship Types

belongs_to

references

generated_from

contains

depends_on

blocks

related_to

assigned_to

uses_template

attached_to

derived_from

---

# Metadata

Every object stores flexible metadata.

Example

File

{
 "extension":"docx",
 "pages":18
}

Task

{
 "priority":"high",
 "storyPoints":5
}

Meeting

{
 "duration":60,
 "location":"Zoom"
}

Do NOT create unnecessary columns.

Use JSON metadata.

---

# AI Summary

Every object stores

aiSummary

Generated automatically.

Example

"This proposal contains implementation details for ABC Hospital."

Used for

Search

Recommendations

AI Context

---

# Universal Activity

Every object generates activity.

Created

Updated

Archived

Deleted

Shared

Referenced

Viewed

Downloaded

AI Generated

---

# Permissions

Permissions apply to Objects.

Not modules.

Every object supports

View

Comment

Edit

Delete

Share

Move

Archive

---

# API

GET

/api/v1/objects

GET

/api/v1/objects/:id

POST

/api/v1/objects

PATCH

/api/v1/objects/:id

DELETE

/api/v1/objects/:id

---

# Search

Universal Search must search Objects.

Not tables.

Search

Projects

Tasks

Files

Templates

Meetings

Knowledge

Prompts

using one endpoint.

---

# AI Context

When AI receives context,

it receives Objects.

Example

Current Workspace

↓

Project

↓

Folder

↓

Files

↓

Meeting

↓

Prompt History

↓

Templates

Everything is Objects.

Never custom payloads.

---

# Engineering Principle

The Universal Object System is the heart of Flox.

Everything is an Object.

Every Object has relationships.

Every Object has AI context.

Every Object can be searched.

Every Object can be automated.

Never build features around tables.

Build them around Objects.

Every future feature should extend the Object model rather than introducing isolated systems.