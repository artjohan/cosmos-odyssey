# Cosmos Odyssey

## About
The goal for this project was to build a web application that shows customers the best interplanetary travel options in our solar system. 

Users can select their origin and destination planets and the application will show them all of the possible routes between those planets. 

Once a user is happy with their chosen route, they can reserve it by entering their first and last name.

## Instructions

### Starting with Docker:

- Clone this repository `git clone https://github.com/artjohan/cosmos-odyssey`
- Build project with `docker-compose up --build -d`
- Navigate to `http://localhost:3000/` in your browser

### Starting with terminal:

- Make sure that the latest version of [Go](https://go.dev/doc/install) is installed
- Run `go run ./backend/cmd/server` in the root directory of the project
- Navigate to the frontend folder and run `npm install --force`
- Run `npm start` once all the necessary packages have been installed

## Technologies

- Go
- Javascript
- React
- HTML
- CSS
- Bootstrap
- SQLite (sqlite3)
- docker
