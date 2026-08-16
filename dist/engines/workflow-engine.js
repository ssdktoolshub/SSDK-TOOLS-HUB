// SSDK Workflow Engine - Chaining and Data Pipeline
// Connects separate tool execution instances together (e.g., Compress -> Resize -> Convert).

export class WorkflowEngine {
  constructor() {
    this.core = null;
    this.history = [];
    this.pipelineData = null;
  }

  async init(core) {
    this.core = core;
    console.log("[WorkflowEngine] Registered dynamic chain pipeline.");
  }

  /**
   * Set pipeline input data for the next tool in sequence.
   */
  setPipelineData(data, sourceToolId) {
    this.pipelineData = {
      data,
      sourceToolId,
      timestamp: Date.now()
    };
    console.log(`[WorkflowEngine] Pipeline set from tool: ${sourceToolId}`);
  }

  /**
   * Consume pipeline data, returning it if valid.
   */
  consumePipelineData() {
    if (!this.pipelineData) return null;
    
    // Valid for 5 minutes
    const isExpired = (Date.now() - this.pipelineData.timestamp) > 300000;
    if (isExpired) {
      this.pipelineData = null;
      return null;
    }
    
    const data = this.pipelineData;
    this.pipelineData = null; // Clear single-use pipeline data
    return data;
  }

  /**
   * Generates a chaining toolbar layout for the dynamic tool view.
   */
  renderWorkflowActionBar(containerId, currentToolId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pipelineAlert = this.consumePipelineData();
    if (pipelineAlert) {
      const msg = `📥 Loaded data chain from "${pipelineAlert.sourceToolId}"!`;
      this.core.getEngine("notification")?.show(msg, "info");
      
      // Inject input field value if matching textareas exist
      const inputField = document.querySelector("#tool-inputs-container textarea, #toolInput");
      if (inputField) {
        inputField.value = pipelineAlert.data;
        // Trigger custom change event for modules to pick up
        inputField.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }
}
