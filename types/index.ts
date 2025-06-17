interface Project {
  id: string;
  name: string;
  code: string; // Format: XXX
}

interface Module {
  id: string;
  name: string;
  code: string; // Format: XX
  projectId: string; // Reference to the associated project
}

interface Error {
  id: string;
  name: string;
  description: string;
  code: string; // Format: XXX-XX-XXX
  moduleId: string; // Reference to the associated module
}

export { Project, Module, Error };