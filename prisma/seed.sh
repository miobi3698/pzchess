#!/bin/bash

cd data
curl https://database.lichess.org/lichess_db_puzzle.csv.zst | unzstd > lichess_db_puzzle.csv
sqlite3 dev.db ".import -csv lichess_db_puzzle.csv puzzle"
