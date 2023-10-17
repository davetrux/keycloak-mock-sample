# Keycloak Mocking Demo


## Set Up Keycloak in Docker

```bash
docker run -d --name keycloak --restart always  -p 8091:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:22.0.4 start-dev
```

### Configure Keycloak