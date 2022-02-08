<template>
  <div class="overflow">
      <slot></slot>
  </div>
</template>


<style lang="scss" scoped>
  .overflow{
    overflow-x: auto;
  }
::v-slotted(table) {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;

  thead {
    border-bottom: 1px solid #cccccc;
  }

  th {
    text-align: left;
    padding: 8px;
  }
  td {
    text-align: left;
    padding: 8px;
  }
  tr {
    &:nth-child(even) {
      background-color: #f2f2f2;
      color: #000;
    }
  }

  @media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
      min-width: 300px;
      display: block;

    thead {
      display: block;
      tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
      }
    }
    tbody {
      display: block;
    }
    th {
      display: block;
    }
    td {
      display: block;
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 50%;
      &:before {
        position: absolute;
        top: 0;
        left: 6px;
        width: 45%;
        padding-right: 10px;
        white-space: nowrap;
      }
    }
    tr {
      display: block;
      margin: 0 0 1rem 0;
      &:nth-child(odd) {
        background: #ccc;
        color: #000;
      }
    }
  }
}

</style>