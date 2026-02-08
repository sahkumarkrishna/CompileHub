import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiDownload, FiShare2, FiEdit2, FiTrash2, FiSave, FiX, FiCode, FiClock, FiPlay } from "react-icons/fi";

const HistoryPage = () => {
    const [snippets, setSnippets] = useState([]);
    const [editingIdx, setEditingIdx] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedCode, setEditedCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedSnippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];
        setSnippets(savedSnippets);
    }, []);

    const updateLocalStorage = (updatedSnippets) => {
        setSnippets(updatedSnippets);
        localStorage.setItem("codeSnippets", JSON.stringify(updatedSnippets));
    };

    const handleDownload = (snippet) => {
        const safeTitle = snippet.title.replace(/[^a-z0-9]/gi, "_");
        const element = document.createElement("a");
        const file = new Blob([snippet.code], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = safeTitle + ".txt";
        document.body.appendChild(element);
        element.click();
        toast.success("Downloaded successfully!");
    };

    const handleShare = async (snippet) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: snippet.title,
                    text: snippet.code,
                });
                toast.success("Shared successfully!");
            } catch (err) {
                toast.error("Sharing failed!");
            }
        } else {
            navigator.clipboard.writeText(snippet.code);
            toast.success("Code copied to clipboard!");
        }
    };

    const handleDelete = (idx) => {
        const updated = [...snippets];
        updated.splice(idx, 1);
        updateLocalStorage(updated);
        toast.success("Removed successfully!");
    };

    const startEditing = (idx) => {
        setEditingIdx(idx);
        setEditedTitle(snippets[idx].title);
        setEditedCode(snippets[idx].code);
    };

    const saveEdit = () => {
        const updated = [...snippets];
        updated[editingIdx].title = editedTitle;
        updated[editingIdx].code = editedCode;
        updateLocalStorage(updated);
        setEditingIdx(null);
        toast.success("Updated successfully!");
    };

    const cancelEdit = () => {
        setEditingIdx(null);
    };

    const runInCompiler = (snippet) => {
        localStorage.setItem("tempCode", JSON.stringify(snippet));
        navigate("/compileCode");
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white py-16 px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fadeIn">
                    <h2 className="text-5xl sm:text-6xl font-black gradient-text mb-4">
                        Code History
                    </h2>
                    <p className="text-gray-400 text-xl">Your saved code snippets and executions</p>
                </div>

                {snippets.length === 0 ? (
                    <div className="text-center py-20 animate-fadeIn">
                        <div className="card max-w-md mx-auto">
                            <FiCode className="mx-auto text-emerald-400 mb-4" size={64} />
                            <p className="text-gray-300 text-lg mb-2">No saved snippets yet!</p>
                            <p className="text-gray-500 text-sm">Start coding to see your history here</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {snippets.map((snippet, idx) => (
                            <div
                                key={idx}
                                className="card hover:scale-105 transition-all duration-300 animate-fadeIn p-0 overflow-hidden"
                            >
                                {editingIdx === idx ? (
                                    <div className="p-6 space-y-4">
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="w-full bg-gray-800/50 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            value={editedCode}
                                            onChange={(e) => setEditedCode(e.target.value)}
                                            className="w-full bg-gray-800/50 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 font-mono text-sm h-40"
                                            placeholder="Code"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveEdit}
                                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded-xl font-semibold transition-all"
                                            >
                                                <FiSave size={16} /> Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-xl font-semibold transition-all"
                                            >
                                                <FiX size={16} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-bold text-white truncate">{snippet.title}</h3>
                                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold uppercase">
                                                    {snippet.language}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <FiClock size={12} />
                                                <span>{new Date(snippet.title.split(" ").slice(1).join(" ")).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <pre className="bg-gray-900/50 p-4 rounded-xl text-xs overflow-x-auto max-h-32 border border-gray-700/50 font-mono text-gray-300">
                                                {snippet.code.length > 200
                                                    ? snippet.code.substring(0, 200) + "..."
                                                    : snippet.code}
                                            </pre>

                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                <button
                                                    onClick={() => runInCompiler(snippet)}
                                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-4 py-3 rounded-xl font-semibold transition-all text-sm"
                                                >
                                                    <FiPlay size={14} /> Run
                                                </button>
                                                <button
                                                    onClick={() => startEditing(idx)}
                                                    className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold transition-all text-sm"
                                                >
                                                    <FiEdit2 size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleShare(snippet)}
                                                    className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold transition-all text-sm"
                                                >
                                                    <FiShare2 size={14} /> Share
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(snippet)}
                                                    className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 px-4 py-3 rounded-xl font-semibold transition-all text-sm"
                                                >
                                                    <FiDownload size={14} /> Download
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(idx)}
                                                className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-3 rounded-xl font-semibold transition-all text-sm border border-red-500/20"
                                            >
                                                <FiTrash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HistoryPage;
