<template>
  <div>
    <h1>欢迎来到错误码记录系统</h1>
    <nav>
      <ul>
        <li><nuxt-link to="/projects">项目管理</nuxt-link></li>
        <li><nuxt-link to="/modules">模块管理</nuxt-link></li>
        <li><nuxt-link to="/errors">错误管理</nuxt-link></li>
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