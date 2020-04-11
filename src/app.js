const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

// \/ Validates if the Repository ID is a valid uuid
function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
  return response.status(400).json({ error: 'Invalid Repository ID!'});
  }
  return next();
}

// \/ Validates if the Repository ID exists in repositories array
function validateRepositoryExists(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  if (!repository) {
    return response.status(400).json({ error: 'This Repository ID does not exist!'});
  }
  return next();
}

app.use(express.json());
app.use(cors());

// \/ Applies Repository ID checks to specific routes
app.use('/repositories/:id', validateRepositoryId, validateRepositoryExists);
app.use('/repositories/:id/like', validateRepositoryId, validateRepositoryExists);

const repositories = [];

// \/ List all repositories
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// \/ Create new repository, like: 0
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

// \/ Update repository (except likes)
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const repositoryLikes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositoryLikes
  }
  
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

// \/ Delete repository
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  repositories.splice(repositoryIndex,1)
  return response.status(204).send();
});

// \/ Add likes to an existing repository
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);
  
  repository.likes ++;

  return response.json(repository);
});

module.exports = app;
