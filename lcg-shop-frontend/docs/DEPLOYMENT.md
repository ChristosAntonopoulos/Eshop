# LCG Shop — Kubernetes & Azure DevOps

Deploys like **coffee-brain**, on the same cluster, different NodePort.

| App           | Namespace      | NodePort | URL                          |
|---------------|----------------|----------|------------------------------|
| coffee-brain  | coffee-brain   | 30081    | http://185.193.66.50:30081/  |
| LCG Shop      | lcg-shop       | 30083    | http://185.193.66.50:30083/  |

## Repo layout

```
Eshop/
├── azure-pipelines.yml          # CI/CD (trigger: lcg-shop-frontend/*)
└── lcg-shop-frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── .dockerignore
    └── k8s/
        ├── namespace.yaml
        ├── deployment.yaml
        ├── service.yaml      # NodePort 30083
        └── ingress.yaml      # optional
```

## Docker image

- **Local name:** `lcg-shop:latest`
- **Docker Hub:** `botsystem13/lcg-shop:latest`

Build locally:

```bash
cd lcg-shop-frontend
docker build -t lcg-shop:latest .
docker run -p 8080:80 lcg-shop:latest
# → http://localhost:8080
```

## Kubernetes (manual)

On the same agent/node where `kubectl` already works for coffee-brain:

```bash
kubectl apply -f lcg-shop-frontend/k8s/namespace.yaml
kubectl apply -f lcg-shop-frontend/k8s/deployment.yaml
kubectl apply -f lcg-shop-frontend/k8s/service.yaml
kubectl rollout status deployment/lcg-shop -n lcg-shop
```

Check:

```bash
kubectl get pods,svc -n lcg-shop
curl -s http://185.193.66.50:30083/ | head
```

## Build-time API URL

The SPA is static. To point at a real API after the C# backend exists, set pipeline build args:

```yaml
--build-arg VITE_USE_MOCK_DATA=false
--build-arg VITE_API_BASE_URL=http://YOUR_API_HOST/api
```

Then rebuild and redeploy.

## NodePort conflicts

If `30083` is already in use:

```bash
kubectl get svc -A | grep 30083
```

Edit `k8s/service.yaml` `nodePort` and `azure-pipelines.yml` variable `publicUrl`, then redeploy.
