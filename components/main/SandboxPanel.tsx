import React, { useState, useEffect, useCallback } from 'react';
import { OpenAI_Assistant, SandboxFile } from '../../types';
import * as openAiService from '../../services/openAiService';
import Button from '../ui/Button';
import { UploadIcon } from '../icons/UploadIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { FileIcon } from '../icons/FileIcon';
import Spinner from '../ui/Spinner';

interface SandboxPanelProps {
  assistant: OpenAI_Assistant;
}

const SandboxPanel: React.FC<SandboxPanelProps> = ({ assistant }) => {
  const [files, setFiles] = useState<SandboxFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!assistant.openAiAssistantId) {
      setIsLoading(false);
      setError("This assistant has no associated ID.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const openAiFiles = await openAiService.listSandboxFiles(assistant.openAiAssistantId);
      const formattedFiles: SandboxFile[] = openAiFiles.map(file => ({
          id: file.id,
          name: file.filename,
          bytes: file.bytes,
          createdAt: file.created_at * 1000, // Convert UNIX timestamp (seconds) to milliseconds
      }));
      setFiles(formattedFiles.sort((a,b) => b.createdAt - a.createdAt));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch sandbox files.");
    } finally {
      setIsLoading(false);
    }
  }, [assistant.openAiAssistantId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !assistant.openAiAssistantId) return;

    setIsUploading(true);
    setError(null);
    try {
      await openAiService.uploadFileToSandbox(assistant.openAiAssistantId, selectedFile);
      // Refresh the file list
      fetchFiles();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload file to sandbox.");
    } finally {
      setIsUploading(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!assistant.openAiAssistantId || !window.confirm("Are you sure you want to delete this file from the sandbox? This action is irreversible.")) return;
    
    try {
        await openAiService.deleteFileFromSandbox(assistant.openAiAssistantId, fileId);
        setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete file from sandbox.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Sandbox Files</h2>
          <p className="text-text-secondary mt-1">Upload files for your assistant to use with the Code Interpreter.</p>
        </div>
        <Button onClick={() => document.getElementById('sandbox-file-upload')?.click()} disabled={isUploading}>
          {isUploading ? <><Spinner /> Uploading...</> : <><UploadIcon className="w-5 h-5"/> Upload File</>}
        </Button>
        <input type="file" id="sandbox-file-upload" className="hidden" onChange={handleFileChange} />
      </div>

      {error && <div className="p-4 mb-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}

      <div className="bg-surface rounded-lg border border-border">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">Loading sandbox files...</div>
        ) : files.length > 0 ? (
          <ul className="divide-y divide-border">
            {files.map(file => (
              <li key={file.id} className="p-4 flex justify-between items-center hover:bg-surface-hover/50">
                <div className="flex items-center gap-4 overflow-hidden">
                  <FileIcon className="w-6 h-6 text-text-secondary flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium text-text-primary truncate" title={file.name}>{file.name}</p>
                    <p className="text-sm text-gray-400 truncate" title={file.id}>ID: {file.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-sm text-gray-400">{(file.bytes / 1024).toFixed(2)} KB</span>
                  <button onClick={() => handleDeleteFile(file.id)} className="p-2 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-400">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-text-secondary">No files in the sandbox. Upload a file to get started.</div>
        )}
      </div>
    </div>
  );
};

export default SandboxPanel;