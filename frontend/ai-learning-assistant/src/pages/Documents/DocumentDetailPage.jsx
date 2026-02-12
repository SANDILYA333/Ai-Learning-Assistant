import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import AiActions from "../../components/ai/AiActions";
import FlashcardManager from "../../components/flashcards/FlashcardManager";
import QuizManager from "../../components/quizzes/QuizManager";


const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // Helper to build full PDF URL
  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    const baseUrl =
      process.env.REACT_APP_API_URL || "http://localhost:8000";

    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) return <Spinner />;

    if (!document || !document.data || !document.data.filePath)
      return (
        <div className="text-center text-slate-500 py-16">
          Document not available.
        </div>
      );

    const pdfUrl = getPdfUrl();

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/40 px-6 py-4">
          <span className="text-sm font-medium text-slate-700">
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-300/40 overflow-hidden animate-scaleIn">
          <iframe
            src={pdfUrl}
            className="w-full h-[75vh]"
            title="PDF Viewer"
          />
        </div>
      </div>
    );
  };

  /* 
     NEWLY ADDED BLOCK STARTS
     */

  const renderChat = () => {
    return <ChatInterface/>;
  };

  const renderAIActions = () => {
    return <AiActions/>;
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id}/>;
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id}/>;
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return <div className="">Document not found.</div>;
  }

  /* 
     NEWLY ADDED BLOCK ENDS
     */

  if (loading) return <Spinner />;

  if (!document)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Document not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-8">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8 animate-fadeIn">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
            {document.data?.title || "Document"}
          </h1>
          <p className="text-sm text-slate-500">
            View and interact with your uploaded content
          </p>
        </div>

        <div className="flex gap-4 border-b border-slate-200 pb-2">
          {["Content", "Chat", "AI Actions", "Flashcards", "Quizzes"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
                  activeTab === tab
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div>
          {activeTab === "Content" && renderContent()}
          {activeTab === "Chat" && renderChat()}
          {activeTab === "AI Actions" && renderAIActions()}
          {activeTab === "Flashcards" && renderFlashcardsTab()}
          {activeTab === "Quizzes" && renderQuizzesTab()}
        </div>

      </div>
    </div>
  );
};

export default DocumentDetailPage;
