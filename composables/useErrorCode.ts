import { ref } from 'vue';

export function useErrorCode() {
    const errorCodes = ref([]);
    let projectCounter = 0;
    let moduleCounter = 0;
    let errorCounter = 0;

    const createProject = (projectName, projectId) => {
        if (errorCodes.value.some(code => code.projectId === projectId)) {
            throw new Error('Project ID must be unique');
        }
        projectCounter++;
        errorCodes.value.push({ projectName, projectId, modules: [] });
    };

    const createModule = (projectId, moduleName, moduleId) => {
        const project = errorCodes.value.find(code => code.projectId === projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        if (project.modules.some(module => module.moduleId === moduleId)) {
            throw new Error('Module ID must be unique within the project');
        }
        moduleCounter++;
        project.modules.push({ moduleName, moduleId, errors: [] });
    };

    const createError = (projectId, moduleId, errorName, errorDescription) => {
        const project = errorCodes.value.find(code => code.projectId === projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        const module = project.modules.find(mod => mod.moduleId === moduleId);
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