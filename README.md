## Requirements
- node or nvm with node in v20.9.0
- docker (to run docker locally)

## Steps to run app locally :rocket:
1. copy `.env.test` template 
2. replace name `.env.test` to `.env`
3. replace `.env` information with valid one
4. npm i
5. npm run start

## Steps to run app with docker ⚡
1. docker compose up
2. open http://localhost:3000 


### Project Notes:
- worker and app are in the same app

- to run worker, you must set env var `ENABLE_SYNC_WORKER` to "true"

- local films and external films differs in one property: externalId.
externalId field its used to distinguish one from other.

- worker syncs external films by default (that means that by default, local films created by api are not deleted, you can enable this behavior with an specific option)

- worker now runs every 20 seconds, you should change this in the code `@Cron` decorator with desired value.