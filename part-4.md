## 4.01

```sh
kekalainen@Z97:~$ kubectl config use-context k3d-k3s-default
Switched to context "k3d-k3s-default".
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./manifests/ingress.yaml 
ingress.networking.k8s.io/ingress created
kekalainen@Z97:~$ kubectl apply -f ./main-app/manifests/
configmap/hashgenerator-configmap created
deployment.apps/hashgenerator-deployment created
persistentvolumeclaim/hashgenerator-persistent-volume-claim created
service/hashgenerator-service created
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests/deployment.yaml -f ./ping-pong-app/manifests/sealedsecret.yaml -f ./ping-pong-app/manifests/service.yaml 
deployment.apps/ping-pong-deployment created
sealedsecret.bitnami.com/postgres-secret created
service/ping-pong-service created
```

```sh
kekalainen@Z97:~$ kubectl get pods -n main
NAME                                        READY   STATUS    RESTARTS   AGE
hashgenerator-deployment-6845d4fc6f-n7ddz   1/2     Running   0          34s
ping-pong-deployment-7767b5d5f5-r7ldq       0/1     Running   0          26s
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests/database.yaml 
service/postgres-service created
statefulset.apps/postgres-statefulset created
```

```sh
kekalainen@Z97:~$ kubectl get pods -n main
NAME                                        READY   STATUS    RESTARTS   AGE
hashgenerator-deployment-6845d4fc6f-n7ddz   1/2     Running   0          118s
ping-pong-deployment-7767b5d5f5-r7ldq       0/1     Running   0          110s
postgres-statefulset-0                      0/1     Pending   0          4s
kekalainen@Z97:~$ kubectl get pods -n main
NAME                                        READY   STATUS    RESTARTS   AGE
postgres-statefulset-0                      1/1     Running   0          26s
ping-pong-deployment-7767b5d5f5-r7ldq       1/1     Running   0          2m12s
hashgenerator-deployment-6845d4fc6f-n7ddz   2/2     Running   0          2m20s
```
