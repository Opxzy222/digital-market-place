#!/bin/bash

# Array of files/folders and their commit messages
declare -A items=(
    [""]="Commit message for file1"
    ["path/to/file2"]="Commit message for file2"
    ["path/to/folder1"]="Commit message for folder1"
)

# Loop through the items and commit each with its message
for item in "${!items[@]}"; do
    git add "$item"
    git commit -m "${items[$item]}"
done
