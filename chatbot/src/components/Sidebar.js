import React, { useState, createContext, useContext, useRef } from "react";
import {
  ChevronFirst,
  ChevronLast,
  MoreVertical,
  LifeBuoy,
  Settings,
  UploadCloud,
} from "lucide-react";
import logo from "../assests/chatbot.png";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cancelButtonRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleHelpClick = () => setOpen(true);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = ["xlsx", "xls", "doc", "docx", "pdf"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        alert("Invalid file type.");
        return;
      }
      setSelectedFile(file); // Update state with the selected file
    }
  };

  const handleFileUpload = (fileName) => {
    console.log(`${fileName} uploaded!`); // Placeholder for file upload success
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setUploadSuccess(true);
      alert(result.message);
      handleFileUpload(selectedFile.name);
    } catch (error) {
      console.error("Error during file upload:", error);
      alert(`Failed to upload file: ${error}`);
    } finally {
      setUploading(false);
      setUploadProgress(100);
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-gray-100 border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={logo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
              alt="profile1"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>
          <div className="flex p-2 pb-2">
            <label
              className={`relative w-full flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors text-gray-600 group hover:bg-indigo-200 ${
                expanded ? "justify-start" : "justify-center"
              }`}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <UploadCloud size={20} className="text-gray-600" />
              <span
                className={`ml-2 font-semibold ${
                  expanded ? "block" : "hidden group-hover:block"
                }`}
              >
                Upload File
              </span>
            </label>
          </div>
          {/* Upload progress and button */}
          {uploading && (
            <div className="flex p-2 pb-2 justify-center">
              <progress value={uploadProgress} max="100" />
            </div>
          )}
          {selectedFile && !uploading && (
            <div className="flex p-2 pb-2 justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={uploadFile}
              >
                Upload
              </button>
            </div>
          )}
          {uploadSuccess && (
            <div className="p-2 text-center text-grey-600">
              File uploaded successfully!
            </div>
          )}
          {/* End here */}
          <div className="border-t flex p-3">
            <img src={logo} className="w-15 h-12 rounded-md" alt="logo23" />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              } `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">Chatbot</h4>
                <span className="text-xs text-gray-600">help@chatbot.com</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>{" "}
        </nav>
      </aside>
    </div>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded-full bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}

      {!expanded && (
        <div
          className={
            "absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
          }
        >
          {text}
        </div>
      )}
    </li>
  );
}
