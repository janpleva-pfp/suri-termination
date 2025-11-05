import { Client } from '@microsoft/microsoft-graph-client';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { logger } from '@app/src/pages/api/log';
import { logObjectOneLevel } from '@app/src/utils/devlogger';

const { STORAGE_CLIENT_ID, STORAGE_CLIENT_SECRET, STORAGE_TOKEN_ENDPOINT, STORAGE_SITE_ID, STORAGE_DRIVE_ID } =
  process.env;

if (!STORAGE_CLIENT_ID || !STORAGE_CLIENT_SECRET || !STORAGE_TOKEN_ENDPOINT || !STORAGE_SITE_ID || !STORAGE_DRIVE_ID) {
  logger.error('Missing required environment variables for SharePoint upload.', {
    STORAGE_CLIENT_ID,
    STORAGE_CLIENT_SECRET: STORAGE_CLIENT_SECRET ? '***' : undefined,
    STORAGE_TOKEN_ENDPOINT,
    STORAGE_SITE_ID,
    STORAGE_DRIVE_ID,
  });
  throw new Error('Failed to get PDF storage configuration from environment variables');
}

const getToken = async (): Promise<string> => {
  const url = STORAGE_TOKEN_ENDPOINT!;
  const params = new URLSearchParams();
  params.append('client_id', STORAGE_CLIENT_ID!);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('client_secret', STORAGE_CLIENT_SECRET!);
  params.append('grant_type', 'client_credentials');

  const res = await fetch(url, {
    method: 'POST',
    body: params,
  });
  const data = await res.json();
  if (!data.access_token) {
    logger.error('[sapi-uploadFile] - SharePoint token response', { data });
    throw new Error('Failed to get access token');
  }
  return data.access_token;
};

export const uploadFile = async (buffer: Buffer, fileName: string): Promise<string | undefined> => {
  const accessToken = await getToken();

  const client = Client.init({
    authProvider: (done) => done(null, accessToken),
  });

  // Upload to the /pdf-termination subfolder in the drive
  const uploadPath = `/sites/${STORAGE_SITE_ID}/drives/${STORAGE_DRIVE_ID}/root:/pdf-termination/${fileName}:/content`;

  try {
    logger.log(SEVERITY_INFO, `[sapi-uploadFile] File buffer read successfully: ${buffer.length} bytes`);
    logger.log(SEVERITY_INFO, `[sapi-uploadFile] Would upload to path: ${uploadPath}`);
    const response = await client.api(uploadPath).put(buffer);
    logger.log(SEVERITY_INFO, '[sapi-uploadFile] Upload successful', logObjectOneLevel(response));
    return response.webUrl;
  } catch (err: any) {
    logger.log(SEVERITY_ERROR, '[sapi-uploadFile] Upload failed:', logObjectOneLevel(err));
    return undefined;
  }
};

//uploadFile('testUpload.txt');
