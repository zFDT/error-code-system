import { ref } from 'vue';

export function useErrorCode() {
  const errorCodes = ref<any[]>([]);
  let projectCounter = 0;
  let moduleCounter = 0;
  let errorCounter = 0;

  const createProject = (projectName: string, projectCode: string) => {
    if (errorCodes.value.some(code => code.projectCode === projectCode)) {
      throw new Error('Project code must be unique');
    }
    projectCounter++;
    errorCodes.value.push({ projectName, projectCode, modules: [] });
  };

  const createModule = (projectCode: string, moduleName: string, moduleCode: string) => {
    const project = errorCodes.value.find(code => code.projectCode === projectCode);
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.modules.some((module: any) => module.moduleCode === moduleCode)) {
      throw new Error('Module code must be unique within the project');
    }
    moduleCounter++;
    project.modules.push({ moduleName, moduleCode, errors: [] });
  };

  const createError = (projectCode: string, moduleCode: string, errorName: string, errorDescription: string) => {
    const project = errorCodes.value.find(code => code.projectCode === projectCode);
    if (!project) {
      throw new Error('Project not found');
    }
    const module = project.modules.find((mod: any) => mod.moduleCode === moduleCode);
    if (!module) {
      throw new Error('Module not found');
    }
    errorCounter++;
    const errorCode = `${String(projectCounter).padStart(3, '0')}-${String(moduleCounter).padStart(2, '0')}-${String(errorCounter).padStart(3, '0')}`;
    module.errors.push({ errorCode, errorName, errorDescription });
  };

  return {
    errorCodes,
    createProject,
    createModule,
    createError,
  };
}