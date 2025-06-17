import React from 'react';
import ErrorCodeSearch from '../components/ErrorCodeSearch';

const HomePage = () => {
  return (
    <div>
      {/* 错误码查询模块 */}
      <section>
        <h2>错误码查询</h2>
        <ErrorCodeSearch />
      </section>
      {/* 项目列表模块 */}
      {/* <section>
        <h2>项目列表</h2>
        <ProjectList />
      </section> */}
    </div>
  );
};

export default HomePage;