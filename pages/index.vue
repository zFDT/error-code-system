<!--
 * @Date: 2025-06-17 11:04:47
 * @LastEditors: zhanghongxin2 zhanghongxin2@dreame.tech
 * @LastEditTime: 2025-06-17 11:48:13
 * @FilePath: \error-code-system\pages\index.vue
-->
<template>
  <div>
    <h1>欢迎来到错误码记录系统</h1>
    <nav>
      <ul>
        <li><nuxt-link to="/projects">项目管理</nuxt-link></li>
        <li><nuxt-link to="/modules">模块管理</nuxt-link></li>
        <li><nuxt-link to="/errors">错误管理</nuxt-link></li>
        <li><nuxt-link to="/error-code">错误码查询</nuxt-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>

<style scoped>
nav {
  margin-top: 20px;
}
nav ul {
  list-style-type: none;
  padding: 0;
}
nav li {
  margin: 10px 0;
}
</style>