#!/bin/bash

if [ ! -f backend/BookATrip.Api/appsettings.json ]; then
  cp backend/BookATrip.Api/appsettings.Example.json backend/BookATrip.Api/appsettings.json
  echo "Created backend/BookATrip.Api/appsettings.json"
else
  echo "backend/BookATrip.Api/appsettings.json already exists, skipping"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "Created frontend/.env"
else
  echo "frontend/.env already exists, skipping"
fi
