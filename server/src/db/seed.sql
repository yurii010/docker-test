INSERT INTO tasks (title, description, completed)
SELECT title, description, completed
FROM (
  VALUES
    ('Learn Docker basics', 'Images, containers, docker run, docker ps', TRUE),
    ('Write a Dockerfile for backend', 'Use node image, copy package.json, install dependencies', FALSE),
    ('Write a Dockerfile for frontend', 'Try multi-stage build and serve static files', FALSE),
    ('Create docker-compose.yml', 'Backend, frontend and PostgreSQL services', FALSE),
    ('Add a volume for PostgreSQL', NULL, FALSE)
) AS seed (title, description, completed)
WHERE NOT EXISTS (SELECT 1 FROM tasks);
