<template>
  <div class="container-xl mt-4">
    <h1 class="text-center mb-4 text-primary">File Management System</h1>

    <!-- Upload File Section -->
    <div class="card shadow-lg p-4 mb-4 upload-card">
      <h3 class="text-secondary">📤 Upload a File</h3>
      <form @submit.prevent="handleUpload" class="mt-3">
        <div class="input-group mb-3">
          <input
            type="file"
            class="form-control"
            ref="fileInput"
            @change="onFileSelect"
            required
          />
        </div>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="fileName"
            placeholder="Enter file name"
            required
          />
        </div>
        <div class="mb-3">
          <textarea
            type="text"
            class="form-control"
            v-model="fileDescription"
            placeholder="Write file description"
            required
            rows="5"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">
          Upload File
        </button>
      </form>
    </div>

    <!-- Uploaded Files Section -->
    <div class="card shadow-lg p-4 files-card">
      <h3 class="text-secondary">📂 Uploaded Files</h3>
      <div class="table-responsive mt-3">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>File Name</th>
              <th>Description</th>
              <th>File Type</th>
              <th>File Size</th>
              <th>Time Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in files" :key="file._id">
              <td style="max-width: 200px;">
                <input
                  v-if="file.isEditing"
                  v-model="file.newFileName"
                  class="form-control bg-light border-primary"
                />
                <span v-else>{{ file.fileName || "Unnamed" }}</span>
              </td>
              <td style="max-width: 300px;">
                <textarea
                  v-if="file.isEditing"
                  v-model="file.newDescription"
                  class="form-control bg-light border-primary"
                  rows="3"
                />
                <div v-else>
                  <p class="description-container" :class="{'description-container-expanded': file.isExpanded}">
                    {{ file.fileDescription }}
                  </p>
                  <button 
                    v-if="file.fileDescription.length > 117"
                    @click="toggleExpand(file)" 
                    class="btn btn-sm btn-link text-primary">
                    {{ file.isExpanded ? "Read Less" : "Read More" }}
                  </button>
                </div>
              </td>
              <td><span class="badge bg-light text-primary p-2">{{ file.fileType }}</span></td>
              <td>{{ (file.fileSize / 1024).toFixed(2) }} KB</td>
              <td>{{ new Date(file.uploadDate).toLocaleString() }}</td>
              <td>
                <button
                  @click="toggleEdit(file)"
                  class="btn btn-sm btn-secondary me-1"
                >
                  {{ file.isEditing ? "Save" : "Edit" }}
                </button>
                <button
                  v-if="file.isEditing"
                  @click="deleteFile(file._id)"
                  class="btn btn-sm btn-danger me-1"
                >
                  Delete
                </button>
                <button
                  v-if="!file.isEditing"
                  @click="download(file._id)"
                  class="btn btn-sm btn-success"
                >
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  uploadFile,
  getFiles,
  updateFile,
  deleteFile,
  downloadFile
} from "../services/fileServices";

export default {
  data() {
    return {
      selectedFile: null,
      fileName: "",
      fileDescription: "",
      files: [],
    };
  },
  methods: {
    async fetchFiles() {
      try {
        const response = await getFiles();
        this.files = response.data.map((file) => ({
          ...file,
          isEditing: false,
          isExpanded: false,
        }));
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    },
    onFileSelect(event) {
      this.selectedFile = event.target.files[0];
    },
    async handleUpload() {
      if (!this.selectedFile) return alert("Please select a file");
      try {
        await uploadFile(
          this.selectedFile,
          this.fileName,
          this.fileDescription
        );
        this.fileName = "";
        this.fileDescription = "";
        this.selectedFile = null;
        this.$refs.fileInput.value = "";
        await this.fetchFiles();
        this.successMessage = "Success";
        this.showModal = true;
      } catch (error) {
        console.error("Upload failed:", error);
      }
    },
    toggleEdit(file) {
      if (file.isEditing) {
        updateFile(file._id, file.newFileName, file.newDescription)
          .then(() => this.fetchFiles())
          .catch((error) => console.error("Error updating file:", error));
      } else {
        file.newFileName = file.fileName;
        file.newDescription = file.fileDescription;
      }
      file.isEditing = !file.isEditing;
    },
    toggleExpand(file) {
      file.isExpanded = !file.isExpanded;
    },
    async deleteFile(id) {
      if (confirm("Are you sure you want to delete this file?")) {
        try {
          await deleteFile(id);
          this.files = this.files.filter((file) => file._id !== id);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    },
    async download(id) {
      await downloadFile(id);
    },
  },
  mounted() {
    this.fetchFiles();
  },
};
</script>

<style scoped>

.upload-card {
  background: #fdfdfe;
  border-left: 5px solid #007bff;
  border-radius: 12px;
}

.files-card {
  background: #ffffff;
  border-left: 5px solid #28a745;
  border-radius: 12px;
}

.description-container {
  max-height: 4.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  transition: max-height 0.3s ease;
}
.description-container-expanded {
  max-height: none;
  -webkit-line-clamp: unset;
}

.table th{
  padding: 10px;
}

.table td{
  padding: 5px;
}
</style>
