# Day 7 Assignment: SnapShare Photo-App Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed containing photos from people they follow.

The following assumptions are used for the calculations:

- Registered users: 10,000,000.
- Daily active users: 10% of registered users.
- Each active user uploads one photo per day.
- Each active user views 50 feed pages per day.
- Each original photo averages 2 MB.
- Each photo also has one thumbnail averaging 50 KB.
- A year contains 365 days.
- Daily activity is averaged across 24 hours for average request rates.
- Peak feed traffic is five times the average feed-view rate.
- Storage calculations use decimal units: 1 TB = 1,000,000 MB.
- Storage estimates exclude database metadata, backups, replication, and additional copies of photos.

## 2. Traffic and Storage Calculations

### Daily Active Users

Daily active users are 10% of the 10 million registered users.

10,000,000 × 10% = 1,000,000 daily active users.

Therefore, SnapShare has approximately **1 million daily active users**.

### Uploads Per Second

Each active user uploads one photo per day.

Daily uploads = 1,000,000 × 1 = 1,000,000 photos.

Average uploads per second:

1,000,000 ÷ 86,400 = 11.57 uploads per second.

SnapShare must handle approximately **12 photo uploads per second on average**.

### Feed Views Per Second

Each active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50 = 50,000,000 feed views.

Average feed views per second:

50,000,000 ÷ 86,400 = 578.70 feed views per second.

Peak feed views per second:

578.70 × 5 = 2,893.52 feed views per second.

SnapShare should therefore plan for approximately **579 feed views per second on average and 2,894 at peak**.

These figures represent feed-page requests, not the number of individual photos displayed or downloaded.

### Photo Storage Per Year

Each uploaded photo requires storage for the original photo and its thumbnail.

Original photo storage per day:

1,000,000 × 2 MB = 2,000,000 MB = 2 TB per day.

Original photo storage per year:

2 TB × 365 = 730 TB per year.

Thumbnail storage per day:

1,000,000 × 50 KB = 50,000,000 KB = 50 GB per day.

Thumbnail storage per year:

50 GB × 365 = 18.25 TB per year.

Total photo and thumbnail storage per year:

730 TB + 18.25 TB = 748.25 TB.

SnapShare therefore needs approximately **748.25 TB of new object storage per year**, before replication, backups, and other overheads.

### Calculation Summary

| Metric | Estimate |
|---|---:|
| Registered users | 10,000,000 |
| Daily active users | 1,000,000 |
| Daily photo uploads | 1,000,000 |
| Average uploads per second | 11.57 |
| Daily feed views | 50,000,000 |
| Average feed views per second | 578.70 |
| Peak feed views per second | 2,893.52 |
| Original photo storage per year | 730 TB |
| Thumbnail storage per year | 18.25 TB |
| Total storage growth per year | 748.25 TB |

## 3. Is SnapShare Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view 50 feed pages per day but upload only one photo per day.

This creates approximately 50 feed-page views for every photo upload. The architecture must therefore prioritize fast feed retrieval, caching, and efficient photo delivery.

A CDN can serve frequently requested photos from locations closer to users. An application cache can reduce repeated database queries, while a database read replica can handle read queries without placing all the load on the primary database.

Uploads must still be reliable, and background workers should process thumbnails without slowing down the user's upload experience.

## 4. Why Photos Should Not Be Stored Inside the Database

Photos should be stored in **object storage**, such as Amazon S3, Azure Blob Storage, or Google Cloud Storage, rather than directly inside relational database tables.

Photo files are large and consume substantial storage. Keeping them in object storage makes it easier to scale capacity, manage file access, and deliver photos through a CDN.

The database should store metadata such as the photo ID, uploader ID, caption, upload time, and object-storage key or URL. This keeps database queries focused on structured information instead of large image files.

## 5. SnapShare Architecture Diagram

```text
                        USERS
                          |
             +------------+-------------+
             |                          |
        Feed / Views                Photo Uploads
             |                          |
             v                          v
       +-------------+          +----------------+
       |     CDN     |          | Load Balancer  |
       | Cached Photos|         +----------------+
       +-------------+                   |
             |                           v
             |                  +------------------+
             |                  |  App Servers     |
             |                  |  (Stateless)     |
             |                  +------------------+
             |                    |      |      |
             |                    |      |      +----------------+
             |                    |      |                       |
             |                    v      v                       v
             |              +---------+ +----------------+  +-------------+
             |              |  Cache  | | Primary DB     |  |Object       |
             |              |         | | (Metadata)     |  |Storage      |
             |              +---------+ +----------------+  |(Originals)  |
             |                           |                 +-------------+
             |                           v                       |
             |                    +----------------+              |
             |                    | Read Replica   |              |
             |                    +----------------+              |
             |                                                    |
             |                                                    v
             |                                           +----------------+
             |                                           | Thumbnail Queue|
             |                                           +----------------+
             |                                                    |
             |                                                    v
             |                                           +----------------+
             |                                           | Thumbnail      |
             |                                           | Worker         |
             |                                           +----------------+
             |                                                    |
             |                                                    v
             |                                           +----------------+
             |                                           |Object Storage  |
             |                                           |(Thumbnails)    |
             |                                           +----------------+
             |
             +------ Serves cached photo files
```

## 6. What Each Component Does

- **CDN:** Delivers photos and thumbnails from nearby edge locations, reducing latency and the load on the application servers and object storage.
- **Load balancer:** Distributes incoming application requests across multiple app servers to prevent one server from becoming overloaded.
- **App servers:** Handle user authentication, uploads, feed requests, authorization, and communication with the database, cache, and storage services.
- **Cache:** Stores frequently requested feed data and metadata in fast memory to reduce repeated database queries.
- **Primary database:** Stores structured information such as users, follows, photo metadata, captions, and feed-related records.
- **Read replica:** Handles suitable read queries separately from the primary database, reducing pressure on the primary and increasing read capacity.
- **Object storage:** Stores original photo files and generated thumbnails durably and scales to accommodate hundreds of terabytes of new data each year.
- **Thumbnail queue:** Holds thumbnail-generation jobs so image processing can happen asynchronously instead of delaying the upload request.
- **Thumbnail worker:** Retrieves jobs from the queue, generates smaller versions of uploaded photos, and stores the resulting thumbnails in object storage.

## 7. Step-by-Step Photo Upload Flow

1. A user selects a photo and submits it through the SnapShare application.
2. The load balancer forwards the upload request to an available app server.
3. The app server authenticates the user, checks authorization and file constraints, and validates the upload.
4. The original photo is uploaded to object storage, where it receives a unique storage key.
5. The app server records the photo's metadata and storage key in the primary database.
6. The app server adds a thumbnail-generation job to the thumbnail queue.
7. The application confirms that the upload has been accepted and saved. Thumbnail generation can continue in the background.
8. A thumbnail worker retrieves the job and reads the original photo from object storage.
9. The worker resizes the photo into a thumbnail and saves it to object storage.
10. The photo metadata or processing status is updated if necessary, so the application knows the thumbnail is ready.
11. When users view the feed, the application retrieves feed metadata using the cache and database, while the CDN delivers original photos and thumbnails.

The queue separates upload handling from thumbnail processing. If the thumbnail worker is temporarily busy, uploaded photos can still be saved while thumbnail jobs wait for processing.

## 8. Architecture Trade-Offs

### Trade-Off 1: Cache Speed vs. Data Freshness

Caching feed data improves response times and reduces database load. However, cached information can become outdated when users upload new photos, change captions, or unfollow someone.

SnapShare should use sensible cache expiration and invalidate or update relevant cached entries when important data changes.

### Trade-Off 2: Read Replicas vs. Consistency

A database read replica improves read capacity by distributing queries away from the primary database. However, replication can lag, meaning a newly uploaded photo might not immediately appear in a feed query served by the replica.

The application can direct critical read-after-write requests to the primary database and use the replica for less time-sensitive reads.

### Trade-Off 3: Asynchronous Thumbnails vs. Immediate Availability

Generating thumbnails in a background worker makes uploads faster and allows image processing capacity to scale independently. However, a thumbnail may not be ready immediately after an upload.

SnapShare can display a temporary placeholder or the original photo until the thumbnail is available, and it should retry failed thumbnail jobs.

### Trade-Off 4: Object Storage and CDN vs. Operational Complexity

Object storage and a CDN are suitable for large photo collections and can reduce delivery costs and latency. However, the system must manage storage permissions, cache invalidation, access control, and storage costs.

SnapShare should use private storage where appropriate, controlled access through signed URLs or an authorized image-delivery mechanism, and lifecycle policies to manage older files.

## 9. Conclusion

SnapShare has approximately one million daily active users, 11.57 uploads per second on average, and 578.70 feed views per second on average, with peak feed traffic estimated at 2,893.52 requests per second.

The system is read-heavy, so the design emphasizes CDN delivery, caching, and database read replicas. Original photos and thumbnails belong in object storage, while a queue and background worker handle thumbnail generation without delaying uploads.

This architecture separates application processing, metadata storage, and image delivery so each part can scale according to its workload.
