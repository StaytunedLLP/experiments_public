#!/bin/sh
chmod +x .gh-workflows/hooks/fmt.sh
chmod +x .gh-workflows/hooks/lint.sh

# Change the permissions of the pre-commit file
chmod +x .gh-workflows/hooks/pre-commit

# Create the .git/hooks directory if it doesn't exist
echo "Creating .git/hooks directory if it doesn't exist..."
mkdir -p .git/hooks

# Debugging information
echo "Checking if .gh-workflows/hooks/pre-commit exists..."
if [ ! -f .gh-workflows/hooks/pre-commit ]; then
    echo ".gh-workflows/hooks/pre-commit does not exist. Exiting."
    exit 1
fi

# Check if the .git/hooks directory was created successfully
echo "Checking if .git/hooks directory exists..."
if [ ! -d .git/hooks ]; then
    echo ".git/hooks directory does not exist. Exiting."
    exit 1
fi

# Create a symbolic link from .git/hooks to .githooks
echo "Checking if .git/hooks/pre-commit exists..."
if [ ! -f .git/hooks/pre-commit ]; then
    echo "Copying .gh-workflows/hooks/pre-commit to .git/hooks/pre-commit..."
    cp .gh-workflows/hooks/pre-commit .git/hooks/pre-commit
    if [ $? -ne 0 ]; then
        echo "Failed to copy .gh-workflows/hooks/pre-commit to .git/hooks/pre-commit. Exiting."
        exit 1
    fi
    chmod +x .git/hooks/pre-commit
    echo "Copy successful."
else
    echo ".git/hooks/pre-commit already exists. Skipping copy."
fi
