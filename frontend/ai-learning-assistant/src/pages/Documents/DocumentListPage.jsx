import React, { useState, useEffect } from "react";
import { Plus, FileText, Upload, X, Trash2 } from "lucide-react";


import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";


const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;

    setDeleting(true);

    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title} deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments((prev) =>
        prev.filter((d) => d._id !== selectedDoc._id)
      );
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6 shadow-inner">
            <FileText className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Documents Yet
          </h3>

          <p className="text-sm text-slate-500 mb-8 max-w-md">
            Get started by uploading your first PDF document to begin learning.
          </p>

          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Upload Document
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documents?.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
      {/* Subtle Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
              My Documents
            </h1>
            <p className="text-slate-500 text-sm max-w-sm">
              Manage and organize your learning materials
            </p>
          </div>

          {documents.length > 0 && (
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="shadow-lg shadow-emerald-500/25"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>

        {renderContent()}
      </div>
      {isUploadModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl shadow-slate-300/40 p-8">

      {/* Close button */}
      <button
        onClick={() => setIsUploadModalOpen(false)}
        className="absolute top-5 right-5 p-2 rounded-lg hover:bg-slate-100 transition"
      >
        <X className="w-4 h-4 text-slate-500" strokeWidth={2} />
      </button>

      {/* Modal Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Upload New Document
        </h2>
        <p className="text-sm text-slate-500">
          Add a PDF document to your library
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleUpload} className="space-y-6">

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Document Title
          </label>
          <input
            type="text"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            required
            placeholder="e.g., React Interview Prep"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-sm"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            PDF File
          </label>

          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition cursor-pointer bg-slate-50/60">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Upload className="w-5 h-5 text-white" strokeWidth={2} />
              </div>

              <p className="text-sm text-slate-600">
                {uploadFile ? (
                  <span className="font-medium text-slate-900">
                    {uploadFile.name}
                  </span>
                ) : (
                  <>
                    <span className="font-medium text-emerald-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </>
                )}
              </p>

              <p className="text-xs text-slate-400">
                PDF up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(false)}
            className="h-11 px-5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={uploading}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    {/* Delete Confirmation Modal */}
{isDeleteModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
    onClick={() => setIsDeleteModalOpen(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl shadow-slate-300/40 p-8 animate-scaleIn"
    >
      {/* Close button */}
      <button
        onClick={() => setIsDeleteModalOpen(false)}
        className="absolute top-5 right-5 p-2 rounded-lg hover:bg-slate-100 transition"
      >
        <X className="w-4 h-4 text-slate-500" strokeWidth={2} />
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-red-500" strokeWidth={2} />
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          Confirm Deletion
        </h2>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-600 text-center mb-8">
        Are you sure you want to delete{" "}
        <span className="font-medium text-slate-900">
          {selectedDoc?.title}
        </span>
        ? This action cannot be undone.
      </p>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(false)}
          disabled={deleting}
          className="h-10 px-5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirmDelete}
          disabled={deleting}
          className="h-10 px-5 rounded-xl bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {deleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default DocumentListPage;
