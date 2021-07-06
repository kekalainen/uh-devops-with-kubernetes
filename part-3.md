# 3.01

```sh
kekalainen@Z97:~$ gcloud config set project dwk-gke-319000
Updated property [core/project].
```

```sh
kekalainen@Z97:~$ gcloud services enable container.googleapis.com
```

```sh
kekalainen@Z97:~$ gcloud container clusters create dwk-cluster --zone=europe-north1b
...
Creating cluster dwk-cluster in europe-north1-a...
...
NAME         LOCATION         MASTER_VERSION    MASTER_IP      MACHINE_TYPE  NODE_VERSION      NUM_NODES  STATUS
dwk-cluster  europe-north1-a  1.19.10-gke.1600  35.228.x.x     e2-medium     1.19.10-gke.1600  3          RUNNING
```

```sh
kekalainen@Z97:~$ gcloud container clusters get-credentials dwk-cluster --zone=europe-north1-a
Fetching cluster endpoint and auth data.
kubeconfig entry generated for dwk-cluster.
```

```sh
kekalainen@Z97:~$ kubectl config use-context k3d-k3s-default
Switched to context "k3d-k3s-default".
kekalainen@Z97:~$ kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > master.key
kekalainen@Z97:~$ kubectl config use-context gke_dwk-gke-319000_europe-north1-a_dwk-cluster
Switched to context "gke_dwk-gke-319000_europe-north1-a_dwk-cluster".
kekalainen@Z97:~$ kubectl apply -f ./master.key
secret/sealed-secrets-keysdr97 created
kekalainen@Z97:~$ kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.16.0/controller.yaml
...
```

```sh
kekalainen@Z97:~$ kubectl create namespace main
namespace/main created
kekalainen@Z97:~$ kubectl apply -f ./ping-pong-app/manifests
service/postgres-service created
statefulset.apps/postgres-statefulset created
deployment.apps/ping-pong-deployment created
sealedsecret.bitnami.com/postgres-secret created
service/ping-pong-service created
```

```sh
kekalainen@Z97:~$ kubectl get services -n main
NAME                TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
ping-pong-service   LoadBalancer   10.59.242.147   34.88.x.x     80:31268/TCP   63s
postgres-service    ClusterIP      None            <none>        5432/TCP       63s
```

```sh
kekalainen@Z97:~$ curl 34.88.x.x
pong 0
```
