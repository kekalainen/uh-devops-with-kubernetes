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
