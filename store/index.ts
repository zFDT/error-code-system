import { reactive } from 'vue';

interface Project {
  name: string;
  projectCode: string;
}

interface Module {
  name: string;
  moduleCode: string;
}

interface ErrorItem {
  name: string;
  description: string;
  errorCode: string;
}

const state = reactive({
  projects: [] as Project[],
  modules: [] as Module[],
  errors: [] as ErrorItem[],
});

const createProject = (name: string, projectCode: string) => {
  if (state.projects.find(project => project.projectCode === projectCode)) {
    throw new Error('Project code must be unique');
  }
  state.projects.push({ name, projectCode });
};

const createModule = (name: string, moduleCode: string) => {
  if (state.modules.find(module => module.moduleCode === moduleCode)) {
    throw new Error('Module code must be unique');
  }
  state.modules.push({ name, moduleCode });
};

const createError = (name: string, description: string) => {
  const errorCode = `001-01-${state.errors.length.toString().padStart(3, '0')}`;
  state.errors.push({ name, description, errorCode });
};

export default {
  state,
  createProject,
  createModule,
  createError,
};