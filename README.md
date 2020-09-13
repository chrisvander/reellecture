# 📽 ReelLecture

A tool for running lectures in the era of virtual and remote learning. Creates a video presentation space where the instructor can get feedback on their user's emotions and attention.

## 👨🏼‍💻 Installation
First, you'll want to install MongoDB (reference [here](https://docs.mongodb.com/manual/installation/)). Then, you'll want to type `mongo` in a terminal, and then type 'use ReelLecture' to create a database.

Next, just run:

```
git clone https://github.com/chrisvander/reellecture.git
cd reellecture
npm install && npm start
```

...and you're up and running for development!

The React project listens on port 3000, and the server runs on port 8080.

## 🛠 Building

Run `npm run build` from the frontend directory to generate a build of the project. This will also copy the build folder over to "public" in `./backend`. So, when you run just the backend, it will serve your built React project.