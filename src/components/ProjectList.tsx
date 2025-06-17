import React, { useState, useEffect } from 'react';
import AddProjectModal from './AddProjectModal';

const ProjectList = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/project')
      .then(res => res.json())
      .then(res => setProjects(res.data || []));
  }, []);

  return (
    <div>
      <button onClick={() => setShowAdd(true)}>添加项目</button>
      {/* 添加项目弹窗 */}
      {showAdd && (
        <AddProjectModal
          onClose={() => setShowAdd(false)}
          // ...校验code唯一...
        />
      )}
      {/* 项目列表表格 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>项目名称</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>项目code</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => (
            <tr key={item.code}>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>
                {/* 项目名称可点击 */}
                <a href={`/project/${item.code}/modules`}>{item.name}</a>
              </td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;