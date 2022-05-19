#!/bin/bash

docker-compose down pulse-monitoring-server
docker-compose build pulse-monitoring-server
docker-compose up pulse-monitoring-server -d