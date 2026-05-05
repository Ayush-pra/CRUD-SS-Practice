// const Minio = require("minio");

// const minioClient = new Minio.Client({
//   endPoint: process.env.MINIO_ENDPOINT,
//   port: Number(process.env.MINIO_PORT),
//   useSSL: false,
//   accessKey: process.env.MINIO_ACCESS_KEY,
//   secretKey: process.env.MINIO_SECRET_KEY,
// });

// module.exports = minioClient;

const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET;

const initMinio = async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName);

    if (!exists) {
      // 1️⃣ Create bucket if not exists
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`Bucket '${bucketName}' created ✅`);
    } else {
      console.log(`Bucket '${bucketName}' already exists ✅`);
    }

    // 🔥 ALWAYS APPLY POLICY (THIS IS YOUR FIX)
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(
      bucketName,
      JSON.stringify(policy)
    );

    console.log(`Bucket '${bucketName}' is PUBLIC now ✅`);

  } catch (err) {
    console.error("MinIO init error ❌", err);
  }
};

module.exports = { minioClient, initMinio };