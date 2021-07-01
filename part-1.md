# 1.01

```sh
kekalainen@Z97:~$ k3d cluster create -a 2
INFO[0000] Prep: Network
INFO[0000] Created network 'k3d-k3s-default' (1e6b357381cfa77edd75726a3544be0b69be23da5d884134b93fb3117186eaf4) 
INFO[0000] Created volume 'k3d-k3s-default-images'      
INFO[0001] Creating node 'k3d-k3s-default-server-0'     
INFO[0001] Creating node 'k3d-k3s-default-agent-0'      
INFO[0001] Creating node 'k3d-k3s-default-agent-1'      
INFO[0001] Creating LoadBalancer 'k3d-k3s-default-serverlb' 
INFO[0001] Starting cluster 'k3s-default'
INFO[0001] Starting servers...
INFO[0001] Starting Node 'k3d-k3s-default-server-0'     
INFO[0006] Starting agents...
INFO[0007] Starting Node 'k3d-k3s-default-agent-0'      
INFO[0019] Starting Node 'k3d-k3s-default-agent-1'      
INFO[0026] Starting helpers...
INFO[0026] Starting Node 'k3d-k3s-default-serverlb'     
INFO[0027] (Optional) Trying to get IP of the docker host and inject it into the cluster as 'host.k3d.internal' for easy 
access
INFO[0028] Successfully added host record to /etc/hosts in 4/4 nodes and to the CoreDNS ConfigMap 
INFO[0028] Cluster 'k3s-default' created successfully!
INFO[0028] --kubeconfig-update-default=false --> sets --kubeconfig-switch-context=false
INFO[0028] You can now use it like this:
kubectl config use-context k3d-k3s-default
kubectl cluster-info
```

```sh
kekalainen@Z97:~$ kubectl create deployment hashgenerator --image=kekalainen/uh-devops-with-kubernetes:1.01
deployment.apps/hashgenerator created
```

```sh
kekalainen@Z97:~$ kubectl get deployments
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
hashgenerator   0/1     1            0           11s
kekalainen@Z97:~$ kubectl get pods
NAME                             READY   STATUS    RESTARTS   AGE
hashgenerator-84c9ddb6f7-7hdxf   1/1     Running   0          39s
```

```sh
kekalainen@Z97:~$ kubectl logs -f hashgenerator-84c9ddb6f7-7hdxf
2021-06-30T23:49:00.649Z: 3o5pdzix50o
2021-06-30T23:49:05.650Z: 3o5pdzix50o
```
# 1.02

```sh
kekalainen@Z97:~$ kubectl create deployment web-server --image=kekalainen/uh-devops-with-kubernetes:1.02
deployment.apps/web-server created
kekalainen@Z97:~$ kubectl get pods | grep web
web-server-5646b87cd5-855k7      0/1     ContainerCreating   0          22s
kekalainen@Z97:~$ kubectl logs web-server-5646b87cd5-855k7
Server started on port 8080
```

# 1.03

```sh
kekalainen@Z97:~$ kubectl delete deployment hashgenerator
deployment.apps "hashgenerator" deleted
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./main-app/manifests/deployment.yaml 
deployment.apps/hashgenerator-deployment created
kekalainen@Z97:~$ kubectl get pods | grep hash
hashgenerator-deployment-6b8f69c7c9-s6ws9   1/1     Running   0          57s
kekalainen@Z97:~$ kubectl logs -f hashgenerator-deployment-6b8f69c7c9-s6ws9
2021-07-01T00:30:46.636Z: j759sr3twv
2021-07-01T00:30:51.638Z: j759sr3twv
```

# 1.04

```sh
kekalainen@Z97:~$ kubectl delete deployment web-server
deployment.apps "web-server" deleted
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./project-app/manifests/deployment.yaml 
deployment.apps/web-server-deployment created
kekalainen@Z97:~$ kubectl get pods | grep web
web-server-deployment-5d75885bc6-7dhj7      1/1     Running   0          18s
kekalainen@Z97:~$ kubectl logs web-server-deployment-5d75885bc6-7dhj7
Server started on port 8080
```

# 1.05

```sh
kekalainen@Z97:~$ kubectl get pods | grep web
web-server-deployment-5d75885bc6-7dhj7      1/1     Running   0          18m
kekalainen@Z97:~$ kubectl port-forward web-server-deployment-5d75885bc6-7dhj7 3000:8080
Forwarding from 127.0.0.1:3000 -> 8080
Forwarding from [::1]:3000 -> 8080    
Handling connection for 3000
```

```sh
kekalainen@Z97:~$ curl localhost:3000
{"hostname":"web-server-deployment-5d75885bc6-7dhj7"}
```

# 1.06

```sh
kekalainen@Z97:~$ k3d cluster delete
```

```sh
kekalainen@Z97:~$ k3d cluster create -p "8081:80@loadbalancer" -p "8082:30080@agent[0]" --agents 2
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./project-app/manifests/deployment.yaml 
deployment.apps/web-server-deployment created
kekalainen@Z97:~$ kubectl apply -f ./project-app/manifests/service.yaml 
service/web-server-service created
```

```sh
kekalainen@Z97:~$ curl localhost:8082
{"hostname":"web-server-deployment-5d75885bc6-f7nb6"}
```

# 1.07

```sh
kekalainen@Z97:~$ kubectl apply -f ./main-app/manifests/deployment.yaml 
deployment.apps/hashgenerator-deployment created
kekalainen@Z97:~$ kubectl apply -f ./main-app/manifests/service.yaml 
service/hashgenerator-service created
kekalainen@Z97:~$ kubectl apply -f ./main-app/manifests/ingress.yaml 
ingress.networking.k8s.io/hashgenerator-ingress created
```

```sh
kekalainen@Z97:~$ curl localhost:8081
2021-07-01T02:50:47.581Z: oitzqgo2bif
```

# 1.08

```sh
kekalainen@Z97:~$ kubectl delete -f ./main-app/manifests/ingress.yaml
ingress.networking.k8s.io "hashgenerator-ingress" deleted
```

```sh
kekalainen@Z97:~$ kubectl apply -f ./project-app/manifests/service.yaml
service/web-server-service configured
kekalainen@Z97:~$ kubectl apply -f ./project-app/manifests/ingress.yaml 
ingress.networking.k8s.io/web-server-ingress created
```

```sh
kekalainen@Z97:~$ curl localhost:8081
{"hostname":"web-server-deployment-5d75885bc6-f7nb6"}
```

# 1.09

```sh
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests/deployment.yaml 
deployment.apps/ping-pong-deployment created
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests/service.yaml 
service/ping-pong-service created
kekalainen@Z97:~$ kubectl apply -f ./project-app/manifests/ingress.yaml 
ingress.networking.k8s.io/web-server-ingress configured
```

```sh
kekalainen@Z97:~$ curl localhost:8081
{"hostname":"web-server-deployment-5d75885bc6-f7nb6"}
kekalainen@Z97:~$ curl localhost:8081/pingpong
pong 0
```
