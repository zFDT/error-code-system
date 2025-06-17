import React, { useEffect, useState } from 'react';

const ModuleErrorCodesPage = () => {
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const moduleId = params.get('moduleId');
    fetch(`/api/error?moduleId=${moduleId}`)
      .then(res => res.json())
      .then(res => setErrors(res.data || []));
  }, []);

  return (
    <div>
      <h2>错误码列表</h2>
      <table>
        <thead>
          <tr>
            <th>错误码</th>
            <th>错误名称</th>
            <th>错误描述</th>
          </tr>
        </thead>
        <tbody>
          {errors.map(e => (
            <tr key={e.errorCode}>
              <td>{e.errorCode}</td>
              <td>{e.name}</td>
              <td>{e.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModuleErrorCodesPage;