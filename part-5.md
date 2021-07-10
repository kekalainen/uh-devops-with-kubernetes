# 5.01

## Installing

```sh
kekalainen@Z97:~$ kubectl apply -f ./dummysite/manifests/
clusterrole.rbac.authorization.k8s.io/dummysite-controller created
clusterrolebinding.rbac.authorization.k8s.io/dummysite-controller created
customresourcedefinition.apiextensions.k8s.io/dummysites.kekalainen.me created
deployment.apps/dummysite-controller created
serviceaccount/dummysite-controller created
```

## Testing

```sh
kekalainen@Z97:~$ kubectl apply -f ./dummysite/test-manifests/
namespace/dwk created
dummysite.kekalainen.me/dwk created
dummysite.kekalainen.me/example created
```

```sh
kekalainen@Z97:~$ kubectl get pods | grep dummysite
dummysite-controller-776bdd7c6f-n5kk5   1/1     Running   0          103s
kekalainen@Z97:~$ kubectl logs dummysite-controller-776bdd7c6f-n5kk5
Waiting for Pods to load
Checking consistency for existing DummySites
Opening a watch for DummySites (resource version 127263)
DymmySite "dwk" added
DymmySite "example" added
Creating a Pod for URL "https://devopswithkubernetes.com" to namespace "dwk"
Creating Service "dwk" to namespace "dwk"
Creating Ingress "dwk" to namespace "dwk"
Creating a Pod for URL "https://example.com/" to namespace "default"
Creating Service "example" to namespace "default"
Creating Ingress "example" to namespace "default"
```

```sh
kekalainen@Z97:~$ kubectl get ingresses
NAME      CLASS    HOSTS   ADDRESS                            PORTS   AGE
example   <none>   *       172.25.0.2,172.25.0.3,172.25.0.4   80      114s
kekalainen@Z97:~$ curl http://localhost:8081/example
<!doctype html>
<html>
<head>
    <title>Example Domain</title>
...
kekalainen@Z97:~$ curl http://localhost:8081/dwk
<!DOCTYPE html><html lang="fi">
...
```

```sh
kekalainen@Z97:~$ kubectl delete -f ./dummysite/test-manifests/
namespace "dwk" deleted
dummysite.kekalainen.me "dwk" deleted
dummysite.kekalainen.me "example" deleted
```

```sh
kekalainen@Z97:~$ kubectl logs dummysite-controller-776bdd7c6f-n5kk5
...
DymmySite "dwk" deleted
Deleting Pod "dwk-6gl6m" from namespace "dwk"
Deleting Service "dwk" from namespace "dwk"
Deleting Ingress "dwk" from namespace "dwk"
DymmySite "example" deleted
Deleting Pod "example-wwmwb" from namespace "default"
Deleting Service "example" from namespace "default"
Deleting Ingress "example" from namespace "default"
```

```sh
kekalainen@Z97:~$ kubectl get ingresses
No resources found in default namespace.
kekalainen@Z97:~$ curl http://localhost:8081/example
404 page not found
```
