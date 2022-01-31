const express = require("express");

const { v4: uuidv4, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// MIDDLEWARES

function findRepositoryByIdAndPassIdAndIndex(request, response, next) {
  const repository = repositories.find((user) => user.id === request.params.id);

  // if (!validate(request.params.id)) {
  //   return response
  //     .status(404)
  //     .json({ error: "The repo id is not an valid ID" });
  // }

  if (!repository) {
    return response.status(404).json({ error: "Repository does not exist" });
  }

  const index = repositories.indexOf(repository);

  request.repository = repository;
  request.index = index;
  request.id = repository.id;

  return next();
}

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put(
  "/repositories/:id",
  findRepositoryByIdAndPassIdAndIndex,
  (request, response) => {
    const { repository } = request;
    const updatedRepository = request.body;

    repository.title = updatedRepository.title;
    repository.url = updatedRepository.url;
    repository.techs = updatedRepository.techs;

    return response.status(201).json(repository);
  }
);

app.delete(
  "/repositories/:id",
  findRepositoryByIdAndPassIdAndIndex,
  (request, response) => {
    const { index } = request;

    repositories.splice(index, 1);

    return response.status(204).send();
  }
);

app.post(
  "/repositories/:id/like",
  findRepositoryByIdAndPassIdAndIndex,
  (request, response) => {
    const { repository } = request;

    repository.likes += 1;

    return response.status(201).json(repository);
  }
);

module.exports = app;
