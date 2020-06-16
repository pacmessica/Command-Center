# Command Center Challenge: Full Stack Edition

The frontend application displays a command center dashboard for national accounts with multiple facilities enrolled in DR programs. The dashboard displays all sites for a given account on a map, along with the real-time energy demand of each of their facilities in a table. Facilities belonging to a given organization are also plotted visually on a map.

The project consists of two directories: `server/`, containing the backend golang service, and `js/`, containing the React app.

## Getting Started

### Setting up the Environment

In the root of `server/`, create a `server.env` file. Add the credentials for interacting with the voltus backend client to your server.env file under the keys API_KEY and API_SECRET.

```
API_KEY=bkend_api_key
API_SECRET=bkend_secret
```

### Running the project

To build and run the complete project for the first time, run the following command from the root directory of the project:

```
$ docker-compose up --build
```

When the frontend is ready, go to `http://localhost:3000/{companyID}` ([example](http://localhost:3000/371fc3c9-fb5b-4892-b371-33d49e19b506)) to see a company's dashboard.

To run an already built project, remove the `--build` flag

```
$ docker-compose up
```
