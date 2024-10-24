#!/bin/bash

# PRODUCTION
# git checkout master
# npm i
pm2 start "npm run start" --name=Books-Backend
