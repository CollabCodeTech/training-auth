#!/bin/sh

if [ "$NODE_ENV" = "production" ] ; then
  npm run build
else
  npm run dev
fi