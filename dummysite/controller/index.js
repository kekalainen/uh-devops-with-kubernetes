const k8s = require('@kubernetes/client-node');
const https = require('https');
const JSONStream = require('jsonstream');
const shasum = require('crypto').createHash('sha1');

const kc = new k8s.KubeConfig();

process.env.NODE_ENV === 'development'
	? kc.loadFromDefault()
	: kc.loadFromCluster();

const k8sApiCore = kc.makeApiClient(k8s.CoreV1Api);
const k8sApiNetworking = kc.makeApiClient(k8s.NetworkingV1Api);

const podCache = new k8s.ListWatch('/api/v1/pods', new k8s.Watch(kc), () =>
	k8sApiCore.listPodForAllNamespaces()
);

const httpsGet = (url, options = {}) =>
	new Promise((resolve, reject) => {
		https
			.get(url, options, (res) => {
				data = '';
				res.on('data', (chunk) => (data += chunk));
				res.on('end', () => resolve(data));
			})
			.on('error', (err) => reject(err));
	});

const getPod = (name, namespace) => {
	let pod = podCache.list(namespace);
	if (typeof pod !== 'undefined')
		pod = pod.find(
			(pod) =>
				pod.metadata.labels.app === name &&
				pod.metadata.deletionTimestamp == null
		);
	return typeof pod === 'undefined' ? null : pod;
};

const createPod = (name, namespace, url, data, log = true) => {
	if (log)
		console.log(`Creating a Pod for URL "${url}" to namespace "${namespace}"`);
	k8sApiCore
		.createNamespacedPod(namespace, {
			apiVersion: 'v1',
			kind: 'Pod',
			metadata: {
				generateName: name + '-',
				namespace: namespace,
				labels: {
					app: name,
					url: shasum.copy().update(url).digest('hex'),
				},
			},
			spec: {
				containers: [
					{
						name: 'site',
						image: 'kekalainen/uh-devops-with-kubernetes:5.01-site',
						env: [
							{
								name: 'DATA',
								value: data,
							},
						],
						ports: [
							{
								name: 'http',
								containerPort: 8060,
								protocol: 'TCP',
							},
						],
					},
				],
			},
		})
		.catch((err) => console.error(err));
};

const deletePod = (name, namespace, log = true) => {
	if (log) console.log(`Deleting Pod "${name}" from namespace "${namespace}"`);
	k8sApiCore
		.deleteNamespacedPod(name, namespace)
		.catch((err) => console.error(err));
};

const createService = (name, namespace) => {
	console.log(`Creating Service "${name}" to namespace "${namespace}"`);
	k8sApiCore
		.createNamespacedService(namespace, {
			apiVersion: 'v1',
			kind: 'Service',
			metadata: {
				name: name,
			},
			spec: {
				type: 'ClusterIP',
				selector: {
					app: name,
				},
				ports: [
					{
						name: 'http',
						port: 8060,
						protocol: 'TCP',
						targetPort: 8060,
					},
				],
			},
		})
		.catch((err) => console.error(err));
};

const deleteService = (name, namespace) => {
	console.log(`Deleting Service "${name}" from namespace "${namespace}"`);
	k8sApiCore
		.deleteNamespacedService(name, namespace)
		.catch((err) => console.error(err));
};

const createIngress = (name, namespace) => {
	console.log(`Creating Ingress "${name}" to namespace "${namespace}"`);
	k8sApiNetworking
		.createNamespacedIngress(namespace, {
			apiVersions: 'networking.k8s.io/v1',
			kind: 'Ingress',
			metadata: {
				name: name,
			},
			spec: {
				rules: [
					{
						http: {
							paths: [
								{
									backend: {
										service: {
											name: name,
											port: {
												name: 'http',
											},
										},
									},
									path: '/' + name,
									pathType: 'ImplementationSpecific',
								},
							],
						},
					},
				],
			},
		})
		.catch((err) => console.error(err));
};

const deleteIngress = (name, namespace) => {
	console.log(`Deleting Ingress "${name}" from namespace "${namespace}"`);
	k8sApiNetworking
		.deleteNamespacedIngress(name, namespace)
		.catch((err) => console.error(err));
};

const initDummySite = (object) => {
	httpsGet(object.spec.website_url).then((siteData) => {
		createPod(
			object.metadata.name,
			object.metadata.namespace,
			object.spec.website_url,
			siteData
		);
		createService(object.metadata.name, object.metadata.namespace);
		createIngress(object.metadata.name, object.metadata.namespace);
	});
};

const dummySiteStreamDataCallback = (data) => {
	console.log(
		`DymmySite "${data.object.metadata.name}" ${data.type.toLowerCase()}`
	);
	let pod = getPod(data.object.metadata.name, data.object.metadata.namespace);
	if (pod == null && data.type == 'ADDED') {
		initDummySite(data.object);
	} else if (pod != null) {
		if (data.type == 'MODIFIED') {
			if (
				pod.metadata.labels.url !=
				shasum.copy().update(data.object.spec.website_url).digest('hex')
			) {
				console.log(
					`Recreating Pod for DummySite "${data.object.metadata.name}" in namespace "${pod.metadata.namespace}"`
				);
				httpsGet(data.object.spec.website_url).then((siteData) => {
					createPod(
						data.object.metadata.name,
						data.object.metadata.namespace,
						data.object.spec.website_url,
						siteData,
						false
					);
					deletePod(pod.metadata.name, pod.metadata.namespace, false);
				});
			}
		} else if (data.type == 'DELETED') {
			deletePod(pod.metadata.name, pod.metadata.namespace);
			deleteService(data.object.metadata.name, data.object.metadata.namespace);
			deleteIngress(data.object.metadata.name, data.object.metadata.namespace);
		}
	}
};

const options = {};
kc.applyToRequest(options);

const waitForPods = async () => {
	if (podCache.list().length > 0) {
		let resourceVersion = 0;

		console.log('Checking consistency for existing DummySites');
		/*
            This consistency check doesn't handle cases where
                - resources exist but a corresponding DummySite doesn't
                - a pod exists but corresponding resources don't
                - a pod doesn't exist but other resources do (granted, the attempts to create them will gracefully log an error message).
            None of the above should be in the intended scope of this exercise, so they've been omitted for brevity.
        */
		await httpsGet(
			`${kc.getCurrentCluster().server}/apis/kekalainen.me/v1/dummysites`,
			options
		)
			.then((data) => (data = JSON.parse(data)))
			.then((data) => {
				resourceVersion = data.metadata.resourceVersion;
				data.items.forEach((ds) => {
					if (getPod(ds.metadata.name, ds.metadata.namespace) == null) {
						console.log(
							`Found inconsistencies for DummySite "${ds.metadata.name}" in namespace "${ds.metadata.namespace}"`
						);
						initDummySite(ds);
					}
				});
			})
			.catch((err) => console.error(err));

		console.log(
			`Opening a watch for DummySites (resource version ${resourceVersion})`
		);
		let dummySiteStream = new JSONStream.parse();
		dummySiteStream.on('data', dummySiteStreamDataCallback);
		https
			.get(
				`${
					kc.getCurrentCluster().server
				}/apis/kekalainen.me/v1/dummysites?watch=1&resourceVersion=${resourceVersion}`,
				options,
				(res) => {
					res
						.pipe(dummySiteStream)
						.on('close', () => setTimeout(waitForPods, 250));
				}
			)
			.on('error', (err) => {
				console.error(err);
				setTimeout(waitForPods, 1000);
			});
	} else {
		setTimeout(waitForPods, 1000);
	}
};

console.log('Waiting for Pods to load');
waitForPods();
