import axios from "axios";

const API_URL = "http://localhost:5000/api/files";

export const uploadFile = async (file, fileName, fileDescription) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);
  formData.append("fileDescription", fileDescription);

  return await axios.post(`${API_URL}/upload`, formData);
};

export const getFiles = async () => {
    return await axios.get(API_URL);
};

export const updateFile = async (id, fileName, fileDescription) => {
    return await axios.put(`${API_URL}/${id}`, { fileName, fileDescription });
};

export const deleteFile = async (id) => {
  try {
    console.log("Sending delete request for ID:", id);
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log("Delete response:", response.data);
    return response;
  } catch (error) {
    console.error(
      "Error deleting file:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const downloadFile = async (id) => {
    window.open(`${API_URL}/download/${id}`, "_blank");
};

