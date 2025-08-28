import { GoogleDriveFile } from '../types';

const API_BASE_URL = 'https://www.googleapis.com/drive/v3';

const fetchWithAuth = async (url: string, accessToken: string, options: RequestInit = {}) => {
    if (!accessToken) {
        throw new Error("Google Drive API called without an access token.");
    }
    const headers = new Headers(options.headers || {});
    headers.append('Authorization', `Bearer ${accessToken}`);
    
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch from Google Drive. Check permissions and authentication.' }));
        throw new Error(errorData.error?.message || 'An unknown error occurred with Google Drive.');
    }
    return response;
};

export async function listFiles(accessToken: string, folderId: string = 'root', query: string = ''): Promise<GoogleDriveFile[]> {
    let q = `'${folderId}' in parents and trashed = false`;
    if (query) {
        q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
    }
    const url = `${API_BASE_URL}/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,kind)&orderBy=folder,name`;
    const response = await fetchWithAuth(url, accessToken);
    const data = await response.json();
    return data.files.map((file: any) => ({ ...file, kind: file.mimeType === 'application/vnd.google-apps.folder' ? 'drive#folder' : 'drive#file' }));
}

export async function getFileContent(accessToken: string, fileId: string, mimeType: string): Promise<string> {
    let url: string;
    const isGoogleDoc = mimeType.startsWith('application/vnd.google-apps');

    if (isGoogleDoc) {
        const exportMimeType = (mimeType === 'application/vnd.google-apps.spreadsheet') ? 'text/csv' : 'text/plain';
        url = `${API_BASE_URL}/files/${fileId}/export?mimeType=${exportMimeType}`;
    } else {
        url = `${API_BASE_URL}/files/${fileId}?alt=media`;
    }

    const response = await fetchWithAuth(url, accessToken);
    return response.text();
}