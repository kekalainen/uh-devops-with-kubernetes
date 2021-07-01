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
