# Finance App Helm Chart

This chart deploys the Finance Application on a Kubernetes cluster using Helm.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- A running Kubernetes cluster
- `kubectl` configured to communicate with your cluster

## Installing the Chart

1. Add the Helm repository (if applicable):
   ```bash
   helm repo add my-repo https://charts.myorg.com/
   helm repo update
   ```

2. Install the chart:
   ```bash
   # For development
   helm install finance-app ./charts/finance-app -n finance --create-namespace
   
   # For production with custom values
   helm install finance-app ./charts/finance-app \
     -f values-production.yaml \
     -n finance \
     --create-namespace
   ```

## Uninstalling the Chart

To uninstall/delete the `finance-app` deployment:

```bash
helm delete finance-app -n finance
```

## Configuration

The following table lists the configurable parameters of the Finance App chart and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Container image repository | `your-docker-username/finance-app` |
| `image.tag` | Container image tag | `latest` |
| `image.pullPolicy` | Container image pull policy | `IfNotPresent` |
| `service.type` | Kubernetes service type | `ClusterIP` |
| `service.port` | Service port | `80` |
| `service.targetPort` | Container port | `5173` |
| `ingress.enabled` | Enable ingress | `false` |
| `ingress.className` | Ingress class name | `""` |
| `ingress.hosts` | List of host configurations | See `values.yaml` |
| `resources` | Resource requests/limits | `{}` |
| `nodeSelector` | Node labels for pod assignment | `{}` |
| `tolerations` | Tolerations for pod assignment | `[]` |
| `affinity` | Affinity settings | `{}` |
| `env` | Environment variables | `{}` |

## Example Custom Values

```yaml
replicaCount: 2

image:
  repository: myregistry.example.com/finance-app
  tag: v1.0.0
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 5173

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: finance.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: finance-tls
      hosts:
        - finance.example.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 200m
    memory: 256Mi

env:
  NODE_ENV: production
  API_URL: https://api.example.com
```

## Development

For local development, you can use the included `values-dev.yaml`:

```bash
helm install finance-app ./charts/finance-app -f charts/finance-app/values-dev.yaml -n finance --create-namespace
```

## Notes

- The application is configured to run on port 5173 by default
- Liveness and readiness probes are configured to hit the root path (`/`)
- The chart includes resource limits and requests that can be customized based on your needs

## Troubleshooting

- If pods are not starting, check the logs:
  ```bash
  kubectl logs -n finance -l app.kubernetes.io/name=finance-app
  ```

- To check the status of the deployment:
  ```bash
  kubectl get all -n finance -l app.kubernetes.io/name=finance-app
  ```

## License

MIT
