# Cursor Implementation Guide
# Feature: FR-004 - Intelligent Files
# Product: Flox
# Version: 1.0

---

# Vision

Files are intelligent knowledge objects.

Every file should

Understand itself.

Know its relationships.

Know its history.

Know why it exists.

Know how it was created.

Know what references it.

Know what depends on it.

The AI should treat files as knowledge—not storage.

---

# Philosophy

Traditional

File

↓

Content

Flox

File

↓

Content

↓

Metadata

↓

Relationships

↓

AI Summary

↓

Embeddings

↓

Version History

↓

References

↓

Execution History

↓

Knowledge Graph

---

# Responsibilities

File Service shall support

Create

Upload

Edit

Move

Rename

Delete

Archive

Restore

Duplicate

Export

Import

Preview

Share

Comment

Version

Reference

Favorite

Pin

Lock

Search

Generate

Summarize

Translate

Review

Rewrite

---

# File Types

Markdown

Word

Excel

PowerPoint

PDF

Image

Video

Audio

CSV

JSON

YAML

XML

TXT

HTML

React

Python

Java

Go

Rust

SQL

Canvas

Whiteboard

Database Schema

Future formats must be pluggable.

---

# File Properties

id

workspaceId

projectId

folderId

objectId

name

extension

mimeType

description

status

ownerId

size

checksum

language

encoding

version

storageLocation

thumbnail

coverImage

createdAt

updatedAt

deletedAt

---

# AI Properties

Every file stores

AI Summary

AI Keywords

Embeddings

Topics

Intent

Purpose

Entities

Relationships

Confidence Score

Generation Source

Prompt ID

Execution Plan ID

These fields power search and AI reasoning.

---

# AI Summary

Automatically generated.

Example

Proposal.docx

"This proposal outlines the implementation of Purple Plus HMS for ABC Hospital including pricing, deployment phases, support model, and implementation timeline."

---

# File Relationships

File

↓

belongs_to

Project

↓

references

Budget.xlsx

↓

generated_from

Prompt

↓

created_by

Proposal Agent

↓

uses_template

Proposal Template

Everything is connected.

---

# File Views

List

Grid

Gallery

Preview

Editor

AI View

Timeline

Version History

Graph

---

# AI View

Instead of opening the file,

users see

Summary

Purpose

Related Files

Referenced Files

Dependent Files

Open Questions

Suggested Updates

AI Actions

---

# AI Actions

Every file supports

Explain

Summarize

Improve

Rewrite

Translate

Compare

Review

Continue Writing

Generate Presentation

Generate Spreadsheet

Generate Tasks

Generate Meeting

Generate Code

Find Risks

Generate Checklist

Extract Data

Turn into Workflow

The list grows over time.

---

# Version Control

Every save creates

Version

Timestamp

Editor

AI/Manual

Summary of Changes

Diff

Restore Point

Versions must be immutable.

---

# Knowledge Extraction

Whenever a file changes,

extract

Concepts

Entities

People

Companies

Dates

Locations

Topics

Requirements

Decisions

Risks

Store in Knowledge Graph.

---

# Search

Support

Keyword

Semantic

Hybrid

Natural Language

Entity

Metadata

Relationship

Examples

Find proposal mentioning pharmacy deployment.

Find spreadsheets related to Q3 budget.

Find files created from hospital template.

---

# File Editor

Support

Rich Text

Markdown

Code

Spreadsheet

Presentation

Canvas

Split View

AI Side Panel

Comments

Track Changes

Real-time Collaboration

---

# APIs

POST

/api/v1/files

GET

/api/v1/files

GET

/api/v1/files/{id}

PATCH

/api/v1/files/{id}

DELETE

/api/v1/files/{id}

POST

/api/v1/files/{id}/duplicate

POST

/api/v1/files/{id}/archive

POST

/api/v1/files/{id}/restore

POST

/api/v1/files/{id}/summarize

POST

/api/v1/files/{id}/rewrite

POST

/api/v1/files/{id}/relationships

---

# Events

FileCreated

FileUpdated

FileArchived

FileDeleted

FileShared

VersionCreated

SummaryUpdated

EmbeddingUpdated

RelationshipUpdated

KnowledgeExtracted

---

# Analytics

Track

Views

Edits

AI Actions

Collaborators

Version Count

Reference Count

Knowledge Score

Storage

Downloads

---

# Security

Permissions

Encryption

Audit

Version Protection

Approval Workflow

Sensitive Data Detection

Workspace Isolation

---

# Future Compatibility

Support

Office Documents

Google Docs

Figma Files

GitHub Files

CAD Files

Medical Images

Video Editing

3D Models

MCP Resources

External File Providers

---

# Engineering Principles

Files are not documents.

Files are knowledge.

Every file contributes to workspace intelligence.

Every file increases AI understanding.

The file system becomes the memory system of Flox.