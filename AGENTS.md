# Agent Instructions

This document provides context and guidelines for AI agents working on the **Personal-Investment-Tauri** project.

## Project Overview
A desktop application designed to track Taiwan (TW) stock and ETF investments. Its primary goal is to help the user manage upcoming cash flow and perform asset rebalancing.

## Tech Stack
- **Language**: Rust 1.95.0
- **Framework**: Tauri
- **Target OS**: macOS (darwin)
- **Domain**: Financial tracking, Portfolio rebalancing, TW Market (TWSE/TPEx)

## Development Workflow: OpenSpec
This project utilizes the **OpenSpec** workflow for all major changes. Agents must adhere to the following phases:

1.  **Research & Exploration**: Understand requirements and existing code. Use `/opsx:explore` if needed.
2.  **Proposal**: Use `/opsx:propose` to generate a structured proposal, design, and task list.
3.  **Implementation**: Use `/opsx:apply` to work through tasks sequentially.
4.  **Verification**: Use `/opsx:verify` to ensure the implementation matches the specifications.

## Engineering Standards
- **Idiomatic Rust**: Follow standard Rust conventions (naming, safety, performance).
- **Tauri Patterns**: Use Tauri commands for frontend-backend communication. Ensure security by scoping system access.
- **Investment Logic**: Focus on accuracy in calculations for asset allocation and rebalancing.
- **Documentation**: All architectural decisions and specifications should be recorded in the `openspec/` directory.

## Core Mandates for Agents
- **Validation**: Always verify changes by running tests or the application.
- **Surgical Edits**: Prefer precise edits to files rather than overwriting entire contents when using tools like `replace`.
- **Context Efficiency**: Minimize context usage by using targeted searches and reads.
- **Safety**: Do not commit or expose sensitive information (e.g., API keys for stock data).
