interface Project {
  id: number;
  name: string;
  projectCode: string; // Format: 001
}

interface Module {
  id: number;
  name: string;
  moduleCode: string; // Format: 01
  projectId: number; // Reference to the associated project
}

interface ErrorItem {
  id: number;
  name: string;
  description: string;
  errorCode: string; // Format: 001-01-001
  moduleId: number; // Reference to the associated module
}

export { Project, Module, ErrorItem };