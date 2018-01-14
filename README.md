# startup_boilerplate
Startup boilerplate: React, Golang, Kubernetes

```
docker-compose -f docker-compose.dev.yaml up pg pgadmin
docker-compose -f docker-compose.dev.yaml -f docker-compose.dev.upd.yaml up usersvcupd

docker-compose -f docker-compose.dev.yaml up
```

REST console is available at http://localhost:8080/docs/restapi/console/?host=http://localhost:8080/rest&url=http://localhost:8080/rest/public.swagger.json

