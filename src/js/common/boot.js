requirejs.config({
  // 开发环境js不使用缓存，测试和生产使用固定版本号，避免有事没事都需要打开f12
  // urlArgs: "v=" + new Date().getTime(),
  urlArgs: "v=1.8700",
  baseUrl: "/js",
  paths: {
    "jquery": "jquery.min",
    "templates": "templates",
    "datatables.net": "plugins/dataTables/jquery.dataTables.min",
    "datatables.net-bs": "plugins/dataTables/dataTables.bootstrap",
    "core": "common/core",
    "cache": "common/cache",
    "bootstrap": "bootstrap.min",
    "api": "common/api",
    "http": "common/http",
    "dom": "common/dom",
    "data": "common/data",
    "hoverPreview": "common/hoverPreview",
    "cwindow": "common/cwindow",
    "permission": "common/permission",
    "sweetalert": "plugins/sweetalert/sweetalert2.min",
    "layer": "plugins/layer/layer.min",
    "jqform": "plugins/jqform/jquery.form.min",
    "jqxcore": "plugins/jqwidgets/jqxcore",
    "jqxdata": "plugins/jqwidgets/jqxdata",
    "jqxbuttons": "plugins/jqwidgets/jqxbuttons",
    "jqxscrollbar": "plugins/jqwidgets/jqxscrollbar",
    "jqxdatatable": "plugins/jqwidgets/jqxdatatable",
    "jqxtreegrid": "plugins/jqwidgets/jqxtreegrid",
    "jqxmenu": "plugins/jqwidgets/jqxmenu",
    "bootstrap-multiselect": "plugins/bootstrap-multiselect/bootstrap-multiselect.min",
    "select2": "plugins/select2/select2.min",
    "content": "plugins/content/content.min",
    "artTemplate": "common/artTemplate",
    "validate": "plugins/validate/jquery.validate.min",
    "validates_zh_message": "plugins/validate/messages_zh.min",
    "laydate": "plugins/layer/laydate/laydate",
    "datatables.net-buttons": "plugins/dataTables/extensions/Buttons/js/dataTables.buttons.min",
    "buttons.colVis": "plugins/dataTables/extensions/Buttons/js/buttons.colVis.min",
    "uploadify": "plugins/uploadify/jquery.uploadify",
    "kindeditor": "plugins/kindeditor/kindeditor-min",
    "dndFileUploader": "plugins/kindeditor/dndFileUploader",
    "kindeditorLang": "plugins/kindeditor/lang/zh_CN",
    "DIC": "common/DIC",
    "slideBox": "plugins/slideBox/js/jquery.slideBox.min",
    "highcharts": "plugins/highcharts/js/highcharts",
    "bootstrap-file-input": "plugins/bootstrapFileInput/js/fileinput",
    "bfi-zh": "plugins/bootstrapFileInput/js/locales/zh",
    "dropzoneAmd": "plugins/dropzone/dropzone-amd-module.min",
    "dropzone": "plugins/dropzone/dropzone.min",
    "input": "plugins/pagination/input/input"
  },
  shim: {
    'jquery': {
      'exports': '$'
    },
    'template': {
      'exports': 'template'
    },
    'slideBox': {
      'exports': '$',
      "deps": ['jquery']
    },
    'highcharts': {
      "deps": ['jquery']
    },
    'select2': {
      'exports': '$',
      "deps": ['jquery']
    },
    'validate': {
      "exports": "$",
      "deps": ['jquery']
    },
    'validates_zh_message': {
      "exports": "$",
      "deps": ['jquery', 'validate']
    },
    "bootstrap": {
      "exports": "$",
      "deps": ['jquery']
    },
    "bootstrap-multiselect": {
      "exports": "$",
      "deps": ['jquery', 'bootstrap']
    },
    "jqform": {
      "exports": "$",
      "deps": ['jquery']
    },
    "jqxcore": {
      "exports": "$",
      "deps": ['jquery', 'bootstrap-multiselect']
    },
    "jqxdata": {
      "exports": "$",
      "deps": ['jquery', 'jqxcore']
    },
    "jqxbuttons": {
      "exports": "$",
      "deps": ['jquery', 'jqxcore']
    },
    "jqxscrollbar": {
      "exports": "$",
      "deps": ['jquery', 'jqxcore']
    },
    "jqxdatatable": {
      "exports": "$",
      "deps": ['jquery', 'jqxcore']
    },
    "jqxtreegrid": {
      "exports": "$",
      "deps": ['jquery', 'jqxcore', 'jqxdata', 'jqxbuttons', 'jqxscrollbar', 'jqxdatatable']
    },
    "jqxmenu": {
      "exports": "$",
      "deps": ['jquery', 'jqxcore', 'jqxdata', 'jqxbuttons', 'jqxscrollbar', 'jqxdatatable', 'jqxtreegrid']
    },
    "layer": {
      "deps": ['jquery']
    },
    "laydate": {
      "deps": ['jquery', 'layer']
    },
    "sweetalert": {
      "exports": "$",
      "deps": ['jquery']
    },
    "datatables.net": {
      "exports": '$',
      "deps": ['jquery']
    },
    "datatables.net-bs": {
      "exports": "$",
      "deps": ['jquery', 'datatables.net']
    },
    "datatables.net-buttons": {
      "exports": "$",
      "deps": ['jquery', 'datatables.net', 'datatables.net-bs']
    },
    "buttons.colVis": {
      "exports": "$",
      "deps": ['jquery', 'datatables.net', 'datatables.net-bs', 'datatables.net-buttons']
    },
    "kindeditor": {
      "exports": "$",
      "deps": ['jquery']
    },
    "dndFileUploader": {
      "exports": "$",
      "deps": ['jquery', 'kindeditor']
    },
    "kindeditorLang": {
      "exports": "$",
      "deps": ['jquery', 'kindeditor', 'dndFileUploader']
    },
    "bootstrap-file-input": {
      "exports": "$",
      "deps": ['jquery']
    },
    "bfi-zh": {
      "exports": "$",
      "deps": ['jquery', 'bootstrap-file-input']
    }
  },
  waitSeconds: 15
});