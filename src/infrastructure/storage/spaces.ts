// DigitalOcean Spaces (S3-compatible) client for file uploads
// Bucket: ai6, Region: tor1

const SPACES_KEY = process.env.DO_SPACES_KEY || '';
const SPACES_SECRET = process.env.DO_SPACES_SECRET || '';
const SPACES_BUCKET = process.env.DO_SPACES_BUCKET || 'ai6';
const SPACES_REGION = process.env.DO_SPACES_REGION || 'tor1';
const SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT || `https://${SPACES_REGION}.digitaloceanspaces.com`;

const CDN_URL = `https://${SPACES_BUCKET}.${SPACES_REGION}.cdn.digitaloceanspaces.com`;

interface UploadResult {
  url: string;
  cdnUrl: string;
  key: string;
}

export async function uploadFile(
  key: string,
  body: Buffer | ReadableStream,
  contentType: string,
): Promise<UploadResult> {
  const url = `${SPACES_ENDPOINT}/${SPACES_BUCKET}/${key}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'x-amz-acl': 'public-read',
      Authorization: `AWS ${SPACES_KEY}:${SPACES_SECRET}`,
    },
    body: body as BodyInit,
  });

  if (!response.ok) {
    throw new Error(`Spaces upload failed: ${response.status} ${response.statusText}`);
  }

  return {
    url,
    cdnUrl: `${CDN_URL}/${key}`,
    key,
  };
}

export function getPublicUrl(key: string): string {
  return `${CDN_URL}/${key}`;
}

export function getAvatarKey(userId: string, ext: string = 'webp'): string {
  return `avatars/${userId}.${ext}`;
}

export function getProgramImageKey(programId: string, ext: string = 'webp'): string {
  return `programs/${programId}.${ext}`;
}
