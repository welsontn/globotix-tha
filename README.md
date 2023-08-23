
# Quickstart

Built on Docker Client v4.19.0 in MacOS.

1. `cp .env.example .env.local`. Default values should be enough to quickly compose without issue.
2. Run `bash develop up` will get dev environment started.

With default `.env`, OpenAPI doc can be accessed via `http://localhost:8888/api-docs/` and usable to test server's API endpoint. API Endpoint is located at `http://localhost:8888/api/v1`. Refers to OpenAPI doc on how to use API.

# Notes

- Code is hastily made to accomplish functionality as much as possible.

- There might be some leftover codes generated from using openapi-generator-cli that I missed to remove

- There's lack of validation check when submitting data to server. Never trust client data.

- Only 1 file upload at a time is possible so Plan with multiple Cleaning Favorite with different Map will end up using same image file.

- All PUT methods for Zones, Plan and Map updating are not implemented.

- Filter favorite by robot parameter at `plans/{planId}/favorites` is not implemented.

- For API Documentation, uses `app/swagger/openapi.yaml` as base

## Accessing MongoDB

Database admin can be accessed from `http://localhost:8081`. Credential is based on `.env`.

Alternatively, use your favourite database client and access via `mongodb://<MONGO_USER>:<MONGO_PASS>@localhost:27017`

# Generating Stubs with OpenAPI Generator

For convenience, require Docker Client to be installed.

Currently no suitable generator has been found yet. `nodejs-express-server` generator was picked initially, however the generated codes are using outdated modules and not suitable for production. Furthermore it is not compatible with latest NodeJS version (reportedly version 16 or lower works fine) and has high vulnerability issues requiring upgrading.

Still if want to generate server stubs, go to `app/swagger` and run below command:
```
docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
    -i /local/openapi.yaml \
    -g nodejs-express-server \
    -o /local/out
```

Server stubs will be generated.