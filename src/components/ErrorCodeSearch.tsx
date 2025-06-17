import React, { useState } from 'react';

const ErrorCodeSearch = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any[]>([]);

  const handleSearch = async () => {
    // 支持模糊查询
    const res = await fetch(`/api/error/search?code=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResult(data.data || []);
  };

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="请输入错误码（支持模糊查询）"
      />
      <button onClick={handleSearch}>查询</button>
      {/* 查询结果表格 */}
      <table>
        <thead>
          <tr>
            <th>错误码</th>
            <th>项目名称</th>
            <th>模块名称</th>
            <th>错误名称</th>
            <th>错误描述</th>
          </tr>
        </thead>
        <tbody>
          {result.map(item => (
            <tr key={item.errorCode}>
              <td>{item.errorCode}</td>
              <td>{item.projectName}</td>
              <td>{item.moduleName}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorCodeSearch;