## Command Server APi

The command server is a webserver that serves the following API endpoints

#### `GET /facilities/<organization_id: uuid>`

An endpoint to return a list of sites and locations for a given organization ID.
Example return:

```json
{
  "name": "A Company",
  "id": "71d7420a-e154-4197-aea0-33d9896c9fe3",
  "facilities": [
    {
      "name": "Some Site",
      "coord": [33.749, -84.388],
      "id": "4b740c8c-adaf-48d9-ad1a-c28059aebfb4"
    },
    {
      "name": "Another Site",
      "coord": [36.749, -84.776],
      "id": "4db40a74-7a96-48d7-b8a8-429bca17efa9"
    }
  ]
}
```

Where the top-level `name` is the name of the organization, and `facilities` is a json array of facilities belonging to the organization. The `coord` array in each facility is the latitude and longitude of where they are located.

Companies are fetched from the organization repository, which is currently implemented as a memory store based off a json file that is loaded into memory on startup. If an organization is not found, the repository returns a custom not found error. Currently the handler doesn't check the error type and always returns a 404

#### `POST /facilities/demand`

An endpoint to return the latest demand for a given list of facilities. It expects a POST body with an array of facility ids. Example body:

```json
["4b740c8c-adaf-48d9-ad1a-c28059aebfb4", "4db40a74-7a96-48d7-b8a8-429bca17efa9"]
```

It returns an array of demands for each facility where `demand` is the latest energy demand in kW, `facility_id` is the requested facility id, and `last_seen` is the unix timestamp for the last measured value. Example return:

```json
[
  {
    "demand": 10187.257653555092,
    "facility_id": "4b740c8c-adaf-48d9-ad1a-c28059aebfb4",
    "last_seen": 1569158245.514883
  },
  {
    "demand": 10187.257653555092,
    "facility_id": "4db40a74-7a96-48d7-b8a8-429bca17efa9",
    "last_seen": 1569158246.514883
  }
]
```

This demand is pulled directly from an upstream backend service (see `clients/demand.go`).

If there is an error while fetching the demand for one of the requested facilities, the demand client will return an error. Currently these errors are always returned as an internal server error in the http request.

## Further Improvements

### HTTP Handlers

- Add more context to http error responses (currently we only return status codes).
- Return more accurate http status errors. Currently all errors that originate from the organization repository's GetByID call are returned as 404, and all errors from the demand client's GetReadingsForFacilities are returned as 500.
- All ids from an http request could also be checked to verify they are in the correct uuid format, and return a 400 error if they are not.
- Add a limit to the number of request ids in the `/facilities/demand` call

### Demand Client

The demand client in `client/demand.go` currently always fetches the demand directly from an upstream backend service. Since it's only a requirement that data served to the customer must be no older than 30s, we could add a cache (with for example a 15s expiry) to save collected data so as to avoid unnecessary calls to the external service (if this is a concern).

If a call to the external client fails, it returns an error right away. Retry logic could be added for 500+ status errors.

All calls to the external client are performed concurrently in a go routine. This could be problematic for requests with large numbers of ids. We may want to limit the number of requests to the external service being performed at a time (for example with a buffered channel).

### Testing

To run tests:

```sh
$ go test ./... # unit tests
```
