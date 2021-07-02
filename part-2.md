# 2.01

```sh
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests/deployment.yaml -f ./main-app/manifests/deployment.yaml
deployment.apps/ping-pong-deployment configured
deployment.apps/hashgenerator-deployment configured
```

```sh
kekalainen@Z97:~$ curl localhost:8081/main
2021-07-01T18:19:46.425Z: rv4hpygfls
Ping / Pongs: 2
```

# 2.02

```sh
kekalainen@Z97:~$ kubectl delete deployment web-server-deployment
deployment.apps "web-server-deployment" deleted
kekalainen@Z97:~$ kubectl delete service web-server-service
service "web-server-service" deleted
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./project-app/backend/manifests/deployment.yaml -f ./project-app/backend/manifests/service.yaml -f ./project-app/frontend/manifests/deployment.yaml -f ./project-app/frontend/manifests/service.yaml -f ./manifests/ingress.yaml
deployment.apps/backend-deployment created
service/backend-service created
deployment.apps/frontend-deployment created
service/frontend-service created
ingress.networking.k8s.io/ingress configured
```

# 2.03

```sh
kekalainen@Z97:~$ kubectl create namespace main
namespace/main created
```

```sh
kekalainen@Z97:~$ kubectl delete deployment hashgenerator-deployment ping-pong-deployment
deployment.apps "hashgenerator-deployment" deleted
deployment.apps "ping-pong-deployment" deleted
kekalainen@Z97:~$ kubectl delete service hashgenerator-service ping-pong-service
service "hashgenerator-service" deleted
service "ping-pong-service" deleted
kekalainen@Z97:~$ kubectl delete persistentvolumeclaim hashgenerator-persistent-volume-claim
persistentvolumeclaim "hashgenerator-persistent-volume-claim" deleted
kekalainen@Z97:~$ kubectl patch persistentvolume main-persistent-volume -p '{"spec":{"claimRef":null}}'
persistentvolume/main-persistent-volume patched
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./main-app/manifests/persistent-volume-claim.yaml -f ./main-app/manifests/deployment.yaml -f ./main-app/manifests/service.yaml -f ./ping-pong-app/manifests/deployment.yaml -f ./ping-pong-app/manifests/service.yaml
persistentvolumeclaim/hashgenerator-persistent-volume-claim created
deployment.apps/hashgenerator-deployment created
service/hashgenerator-service created
deployment.apps/ping-pong-deployment created
service/ping-pong-service created
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./manifests/ingress.yaml 
ingress.networking.k8s.io/ingress configured
ingress.networking.k8s.io/ingress created
```

# 2.04

```sh
kekalainen@Z97:~$ kubectl create namespace project
namespace/project created
```

```sh
kekalainen@Z97:~$ kubectl delete deployment backend-deployment frontend-deployment
deployment.apps "backend-deployment" deleted
deployment.apps "frontend-deployment" deleted
kekalainen@Z97:~$ kubectl delete service backend-service frontend-service
service "backend-service" deleted
service "frontend-service" deleted
kekalainen@Z97:~$ kubectl delete ingress ingress
ingress.networking.k8s.io "ingress" deleted
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./project-app/backend/manifests/deployment.yaml -f ./project-app/backend/manifests/service.yaml -f ./project-app/frontend/manifests/deployment.yaml -f ./project-app/frontend/manifests/service.yaml 
deployment.apps/backend-deployment created
service/backend-service created
deployment.apps/frontend-deployment created
service/frontend-service created
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./manifests/ingress.yaml 
ingress.networking.k8s.io/ingress created
ingress.networking.k8s.io/ingress unchanged
```

# 2.05

```sh
kekalainen@Z97:~$ kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.16.0/controller.yamler.yaml
Warning: rbac.authorization.k8s.io/v1beta1 Role is deprecated in v1.17+, unavailable in v1.22+; use rbac.authorization.k8s.io/v1 Role
role.rbac.authorization.k8s.io/sealed-secrets-service-proxier created
role.rbac.authorization.k8s.io/sealed-secrets-key-admin created
service/sealed-secrets-controller created
Warning: rbac.authorization.k8s.io/v1beta1 RoleBinding is deprecated in v1.17+, unavailable in v1.22+; use rbac.authorization.k8s.io/v1 RoleBinding
rolebinding.rbac.authorization.k8s.io/sealed-secrets-service-proxier created
customresourcedefinition.apiextensions.k8s.io/sealedsecrets.bitnami.com created
rolebinding.rbac.authorization.k8s.io/sealed-secrets-controller created
Warning: rbac.authorization.k8s.io/v1beta1 ClusterRoleBinding is deprecated in v1.17+, unavailable in v1.22+; use rbac.authorization.k8s.io/v1 ClusterRoleBinding
clusterrolebinding.rbac.authorization.k8s.io/sealed-secrets-controller created
Warning: rbac.authorization.k8s.io/v1beta1 ClusterRole is deprecated in v1.17+, unavailable in v1.22+; use rbac.authorization.k8s.io/v1 ClusterRole
clusterrole.rbac.authorization.k8s.io/secrets-unsealer created
serviceaccount/sealed-secrets-controller created
deployment.apps/sealed-secrets-controller created
```

```sh
kekalainen@Z97:~$ wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.16.0/kubeseal-linux-amd64 -O kubeseal
kekalainen@Z97:~$ sudo install -m 755 kubeseal /usr/local/bin/kubeseal
kekalainen@Z97:~$ rm ./kubeseal
```

# 2.06

```sh
kekalainen@Z97:~$ kubectl apply -f ./main-app/manifests/configmap.yaml -f ./main-app/manifests/deployment.yaml
configmap/hashgenerator-configmap created
deployment.apps/hashgenerator-deployment configured
```

```sh
kekalainen@Z97:~$ curl localhost:8081/main
Hello
2021-07-02T01:11:02.717Z: r8uv8dgnd1o
Ping / Pongs: 11
```

# 2.07

`~/ping-pong-app/manifests/secret.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  namespace: main
  name: postgres-secret
data:
  POSTGRES_PASSWORD: <redacted>
```

```sh
kekalainen@Z97:~$ kubeseal -o yaml < ./ping-pong-app/manifests/secret.yaml > ./ping-pong-app/manifests/sealedsecret.yaml
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests/sealedsecret.yaml 
sealedsecret.bitnami.com/postgres-secret created
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests/database.yaml 
service/postgres-service created
statefulset.apps/postgres-statefulset created
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests/deployment.yaml 
deployment.apps/ping-pong-deployment configured
```

# 2.08

`~/project-app/backend/manifests/secret.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  namespace: project
  name: postgres-secret
data:
  POSTGRES_PASSWORD: <redacted>
```

```sh
kekalainen@Z97:~$ kubeseal -o yaml < ./project-app/backend/manifests/secret.yaml > ./project-app/backend/manifests/postgres-sealedsecret.yaml 
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./project-app/backend/manifests/postgres-sealedsecret.yaml -f ./project-app/backend/manifests/postgres.yaml
sealedsecret.bitnami.com/postgres-secret created
service/postgres-service created
statefulset.apps/postgres-statefulset created
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./project-app/backend/manifests/deployment.yaml
deployment.apps/backend-deployment configured
```
