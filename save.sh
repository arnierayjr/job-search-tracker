#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide a commit message."
  echo "Usage: ./save.sh \"description of changes\""
  exit 1
fi

git add .
git commit -m "$1"
git push

echo "Resume saved and pushed: $1"