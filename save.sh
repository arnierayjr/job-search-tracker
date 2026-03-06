#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "❌ Error: Please provide a commit message."
  echo "Usage: ./save.sh \"description of changes\""
  exit 1
fi

# Stage all changes
git add .

# Commit with the provided message
git commit -m "$1"

# Push and check if it succeeded
if git push; then
  echo "✅ Resume saved and pushed: $1"
  echo "📅 $(date '+%Y-%m-%d %H:%M:%S')"
else
  echo "❌ Push failed. Check your connection or GitHub credentials."
  exit 1
fi