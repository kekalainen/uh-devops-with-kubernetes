# DevOps with Kubernetes

## Exercices

* [Part 1](./part-1.md)
* [Part 2](./part-2.md)
* [Part 3](./part-3.md)

  ### 3.06: DBaaS vs DIY

  When deploying an application to Kubernetes, one will often require some form of data persistence - typically a database. Especially in the case of relational databases, scalability is a non-trivial issue. Important considerations for picking a database solution include availability, performance, maintainability and cost (partly incurred from maintenance).

  Many cloud providers offer a managed "Database as a Service"-solution, which transparently handles replication, failover and backups among other things. This typically comes at the expense of additional costs and reduced flexibility for custom configurations. Managed databases are often secure by default. Despite that some organizations might require an on-premises solution due to regulatory reasons or otherwise, which naturally rules out using a cloud-based solution. While there are on-premises private DBaaS solutions, setting one up is an undertaking similar to what is described in the following paragraph and therefore does not need to be considered for the purposes of this comparison.

  Another option is to deploy one's own database - this is arguably best done within the cluster to avoid fragmentation of services. The database requires a volume to store data on. A volume's lifecycle depends on the method used to provision it, but typically its persistence cannot be guaranteed thus an external backup server should be set up as well. Performance depends on scalability. Vertical scaling only goes so far as the hardware of a single node allows for. Horizontal scaling requires replication, configuration of which is fairly intricate.

  All in all, both have their advantages and disadvantages and suit partly different use cases. A DBaaS solution is often an ideal choice especially for a small team, since opting for one allows developers to focus on building a product rather than setting up, maintaining and auditing a database. A larger team with sensitive data or in-house expertise might benefit from a self-managed solution.

  ### 3.07: Commitment

  Despite the above write-up, I opted for Postgres with a `PersistentVolumeClaim` for this course's project. This choice is mainly due to high availability, scalability and backups not being concerns. An in-cluster database allows for retaining a comparatively simple deployment workflow configuration as separate logic for provisioning databases for different branches isn't required.

* [Part 4](./part-4.md)
* [Part 5](./part-5.md)
