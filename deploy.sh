#!/bin/bash

# PRODUCTION
git checkout master
npm i
pm2 start process.config.js --env production
