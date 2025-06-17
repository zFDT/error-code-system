import { reactive } from 'vue';

interface Project {
  name: string;
  code: string;
}

interface Module {
  name: string;
  code: string;
}

interface Error {
  name: string;
  description: string;
  code: string;
}

const state = reactive({
  projects: [] as Project[],
  modules: [] as Module[],
  errors: [] as Error[],
});

const createProject = (name: string, code: string) => {
  if (state.projects.find(project => project.code === code)) {
    throw new Error('Project code must be unique');
  }
  state.projects.push({ name, code });
};

const createModule = (name: string, code: string) => {
  if (state.modules.find(module => module.code === code)) {
    throw new Error('Module code must be unique');
  }
  state.modules.push({ name, code });
};

const createError = (name: string, description: string) => {
  const errorCode = `001-001-${state.errors.length.toString().padStart(3, '0')}`;
  state.errors.push({ name, description, code: errorCode });
};

export default {
  state,
  createProject,
  createModule,
  createError,
};