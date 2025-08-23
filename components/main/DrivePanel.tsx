import React, { useState, useEffect, useCallback } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import * as googleDriveService from '../../services/googleDrive';
import { GoogleDriveFile } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';
import { FolderIcon } from '../icons/FolderIcon';
import { FileIcon } from '../icons/FileIcon';

interface DrivePanelProps {
  credential: CredentialResponse;
  onFileSelect: (file: GoogleDriveFile) => void;
}

const DrivePanel: React.FC<DrivePanelProps> = ({ credential, onFileSelect }) => {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([{ id: 'root', name: 'My Drive' }]);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFolder = folderStack[folderStack.length - 1];

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const driveFiles = await googleDriveService.listFiles(credential, currentFolder.id, searchQuery);
      setFiles(driveFiles);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch Google Drive files.');
    } finally {
      setIsLoading(false);
    }
  }, [credential, currentFolder.id, searchQuery]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);
  
  const handleFolderClick = (folder: GoogleDriveFile) => {
    setSearchQuery('');
    setFolderStack(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setSearchQuery('');
    setFolderStack(prev => prev.slice(0, index + 1));
  };
  
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      fetchFiles();
  }

  const FileItem: React.FC<{file: GoogleDriveFile}> = ({ file }) => {
      const isFolder = file.kind === 'drive#folder';
      return (
        <li className="p-3 flex justify-between items-center hover:bg-surface-hover/50 rounded-lg">
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => isFolder && handleFolderClick(file)}>
                {isFolder ? <FolderIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" /> : <FileIcon className="w-6 h-6 text-text-secondary flex-shrink-0" />}
                <span className="font-medium text-text-primary truncate" title={file.name}>{file.name}</span>
            </div>
            {!isFolder && (
                <Button variant="secondary" size="sm" onClick={() => onFileSelect(file)}>
                    Attach
                </Button>
            )}
        </li>
      )
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold">Google Drive</h2>
        <p className="text-text-secondary mt-1 mb-4">Attach a file's content to your prompt.</p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input 
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search files in current folder..."
            />
            <Button type="submit">Search</Button>
        </form>

        <div className="flex items-center text-sm text-text-secondary mb-4">
          {folderStack.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <button onClick={() => handleBreadcrumbClick(index)} className="hover:text-primary hover:underline">
                {folder.name}
              </button>
              {index < folderStack.length - 1 && <span className="mx-2">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {error && <div className="p-4 mb-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}

      <div className="flex-1 bg-surface rounded-lg border border-border overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary flex items-center justify-center gap-3"><Spinner /> Loading files...</div>
        ) : files.length > 0 ? (
          <ul className="p-2">
            {files.map(file => <FileItem key={file.id} file={file} />)}
          </ul>
        ) : (
          <div className="p-8 text-center text-text-secondary">No files or folders found.</div>
        )}
      </div>
    </div>
  );
};

export default DrivePanel;
