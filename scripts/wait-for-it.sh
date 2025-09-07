#!/usr/bin/env bash
# Use this script to wait for a service to be available before running a command.

set -e

host="$1"
shift
cmd="$@"

until curl -s -f -o /dev/null "$host"; do
  >&2 echo "Service is unavailable - sleeping"
  sleep 1
done

>&2 echo "Service is up - executing command"
exec $cmd
