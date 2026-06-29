// SSDK Python Engine - Manages communication with Python FastAPI backend services

export class PythonEngine {
  constructor() {
    this.core = null;
    this.apiBaseUrl = "https://api.ssdktoolshub.com"; // Configured target backend API
  }

  async init(core) {
    this.core = core;
  }

  /**
   * Executes a backend endpoint task with JSON payload.
   */
  async runBackendTask(endpoint, payload = {}) {
    const notification = this.core.getEngine("notification");
    
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API returned error status: ${response.status}`);
      }

      return await response.json();
    } catch (e) {
      console.error("[PythonEngine] API request failed:", e);
      if (notification) {
        notification.show(`API connection error: ${e.message}`, "error");
      }
      throw e;
    }
  }

  /**
   * Uploads multiple files to a backend stream and tracks upload progress.
   */
  async uploadFilesTask(endpoint, filesList, onProgress = null) {
    const formData = new FormData();
    filesList.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${this.apiBaseUrl}${endpoint}`, true);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            onProgress(pct);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Server error: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("API network execution failure"));
      xhr.send(formData);
    });
  }
}
