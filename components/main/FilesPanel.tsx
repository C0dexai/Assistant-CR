import React, { useState, useEffect, useCallback } from 'react';
import { OpenAI_Assistant, VectorStoreFile } from '../../types';
import * as openAiService from '../../services/openAiService';
import Button from '../ui/Button';
import { UploadIcon } from '../icons/UploadIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { FileIcon } from '../icons/FileIcon';
import Spinner from '../ui/Spinner';

interface FilesPanelProps {
  assistant: OpenAI_Assistant;
}

const FilesPanel: React.FC<FilesPanelProps> = ({ assistant }) => {
  const [files, setFiles] = useState<VectorStoreFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!assistant.vectorStoreId) {
      setIsLoading(false);
      setError("This assistant has no associated vector store.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const openAiFiles = await openAiService.listFiles(assistant.vectorStoreId);
      const fileDetailsPromises = openAiFiles.map(async (file) => {
        const details = await openAiService.getFile(file.id);
        return {
          id: file.id,
          name: details.filename,
          status: file.status,
          createdAt: file.created_at,
        };
      });
      const fileDetails = await Promise.all(fileDetailsPromises);
      setFiles(fileDetails.sort((a,b) => b.createdAt - a.createdAt));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch files.");
    } finally {
      setIsLoading(false);
    }
  }, [assistant.vectorStoreId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !assistant.vectorStoreId) return;

    setIsUploading(true);
    setError(null);
    try {
      await openAiService.uploadFile(assistant.vectorStoreId, selectedFile);
      // Refresh the file list after a short delay to allow processing to start
      setTimeout(fetchFiles, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!assistant.vectorStoreId || !window.confirm("Are you sure you want to delete this file? This action is irreversible.")) return;
    
    try {
        await openAiService.deleteFile(assistant.vectorStoreId, fileId);
        setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete file.");
    }
  };

  const StatusBadge: React.FC<{status: VectorStoreFile['status']}> = ({status}) => {
    const base = "px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5";
    const colors = {
        completed: "bg-green-500/20 text-green-300",
        in_progress: "bg-yellow-500/20 text-yellow-300 animate-pulse",
        failed: "bg-red-500/20 text-red-300",
        cancelled: "bg-gray-500/20 text-gray-300",
    }
    return <span className={`${base} ${colors[status]}`}>{status === 'in_progress' ? 'processing' : status}</span>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Files</h2>
          <p className="text-text-secondary mt-1">Upload documents for your assistant to use as a knowledge base.</p>
        </div>
        <Button onClick={() => document.getElementById('file-upload')?.click()} disabled={isUploading}>
          {isUploading ? <><Spinner /> Uploading...</> : <><UploadIcon className="w-5 h-5"/> Upload File</>}
        </Button>
        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".c,.cpp,.csv,.docx,.html,.java,.json,.md,.pdf,.php,.pptx,.py,.rb,.tex,.txt" />
      </div>

      {error && <div className="p-4 mb-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}

      <div className="bg-surface rounded-lg border border-border">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">Loading files...</div>
        ) : files.length > 0 ? (
          <ul className="divide-y divide-border">
            {files.map(file => (
              <li key={file.id} className="p-4 flex justify-between items-center hover:bg-surface-hover/50">
                <div className="flex items-center gap-4">
                  <FileIcon className="w-6 h-6 text-text-secondary" />
                  <div>
                    <p className="font-medium text-text-primary">{file.name}</p>
                    <p className="text-sm text-gray-400">ID: {file.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={file.status} />
                  <button onClick={() => handleDeleteFile(file.id)} className="p-2 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-400">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-text-secondary">No files have been uploaded yet.</div>
        )}
      </div>
    </div>
  );
};

export default FilesPanel;
