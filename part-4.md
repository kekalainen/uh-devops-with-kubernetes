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

## 4.02

`~/project-app/backend/manifests/deployment.yaml`

```yaml
...
          image: BACKEND_IMAGE
          ports:
            - containerPort: 8070
          #envFrom:
          #  - secretRef:
          #      name: postgres-secret
...
```

```sh
kekalainen@Z97:~$ kubectl apply -k ./project-app/                                                   
service/backend-service created
service/frontend-service created
service/postgres-service created
deployment.apps/backend-deployment created
deployment.apps/frontend-deployment created
statefulset.apps/postgres-statefulset created
cronjob.batch/daily-todo-cronjob created
sealedsecret.bitnami.com/postgres-secret created
ingress.networking.k8s.io/ingress created
```

```sh
kekalainen@Z97:~$ kubectl get pods -n project
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-557ddc5bdf-tgl2v   0/1     Running   0          22s
postgres-statefulset-0                1/1     Running   0          22s
frontend-deployment-c6444cf86-zqsqr   1/1     Running   0          22s
```

`~/project-app/backend/manifests/deployment.yaml`

```yaml
...
          image: BACKEND_IMAGE
          ports:
            - containerPort: 8070
          envFrom:
            - secretRef:
                name: postgres-secret
...
```

```sh
kekalainen@Z97:~$ kubectl apply -k ./project-app/
...
deployment.apps/backend-deployment configured
...
```

```sh
kekalainen@Z97:~$ kubectl get pods -n project
NAME                                  READY   STATUS        RESTARTS   AGE
postgres-statefulset-0                1/1     Running       0          110s
frontend-deployment-c6444cf86-zqsqr   1/1     Running       0          110s
backend-deployment-6d4dcfcc66-qf4m8   1/1     Running       0          33s
backend-deployment-557ddc5bdf-tgl2v   0/1     Terminating   1          110s
```
