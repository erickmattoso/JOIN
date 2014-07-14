#!/bin/bash
cd "$(dirname "$0")"

supervisor -w index.js,models index.js
