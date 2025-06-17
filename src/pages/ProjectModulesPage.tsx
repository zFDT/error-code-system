import React, { useState, useEffect } from 'react';
import AddModuleModal from './AddModuleModal';

const ProjectModulesPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('projectId');
    fetch(`/api/module?projectId=${projectId}`)
      .then(res => res.json())
      .then(res => setModules(res.data || []));
  }, []);

  const handleModuleClick = (id: number) => {
    window.location.href = `/errors?moduleId=${id}`;
  };

  return (
    <div>
      <button onClick={() => setShowAdd(true)}>添加模块</button>
      {/* 添加模块弹窗 */}
      {showAdd && (
        <AddModuleModal
          onClose={() => setShowAdd(false)}
          // ...校验code唯一...
        />
      )}
      {/* 模块表格，模块名称可点击 */}
      <table>
        <thead>
          <tr>
            <th>模块名称</th>
            <th>模块编号</th>
          </tr>
        </thead>
        <tbody>
          {modules.map(m => (
            <tr key={m.id}>
              <td>
                <a style={{ cursor: 'pointer', color: '#1677ff' }} onClick={() => handleModuleClick(m.id)}>
                  {m.name}
                </a>
              </td>
              <td>{m.moduleCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectModulesPage;