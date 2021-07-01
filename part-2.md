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
