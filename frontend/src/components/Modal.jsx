
import { X } from "lucide-react";

const Modal = ({ title, content, onClose }) => {
  if (!title || !content) return null; 

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl shadow-lg flex flex-col max-h-[90vh]">
       
        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10 rounded-t-xl">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        <div
          className="overflow-y-auto p-6 text-gray-200 space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        
        <div className="p-4 border-t border-gray-700 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Spektra. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Modal;
