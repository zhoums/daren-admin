/**
 * 公共js将被打倒boot.js里面，页面模板js将被打倒base.js里面
 */
define(function(require) {
  'use strict';
  require("jquery");

  //父窗口准备完毕后再执行子窗口代码
  $(parent.document).ready(function() {
    init();
  });

  /**
   * 判断请求是不是刷新真个页面
   */
  function isFullPageLoad() {
    var currentPage = $("#current-page").attr("current-page");
    if (currentPage !== "login" && currentPage !== "sso_login" && $("#side-menu", parent.document).html() !== undefined && $("#side-menu", parent.document).html().trim() === '') {
      return true;
    } else {
      return false;
    }
  }

  function init() {
    require('jquery');
    var core = require("core");
    var page = $("#current-page").attr("current-page");
    var accountInfo = core.getAccountInfo();
    var api = require("api");
    if (!accountInfo && page !== "login" && page !== "sso_login") {
      core.toLogin();
    }
    var cache = require("cache");
    //动态加载业务模块
    var currentPage = $("#current-page").attr("current-page");
    var targetModule = $("#current-page").attr("target-module");

    require("bootstrap");
    require("datatables.net");
    require("datatables.net-bs");
    require('datatables.net-buttons');
    require('buttons.colVis');
    require("api");
    require("validate");
    require("validates_zh_message");
    require("layer");
    require("laydate");
    require("bootstrap-multiselect");
    require("select2");
    /** 加载页面当发现菜单栏没有加载则进行菜单栏加载 */
    if (isFullPageLoad()) {
      cache.checkLogin();
      $.when(cache.getMenus()).done(function(menus) {
        $("#account", parent.document).html(cache.getAccountInfo().name);
        initMenus(menus);
        var roles = cache.getAccountInfo().roles;
        if (core.isAdmin()) {
          $("#roles", parent.document).text("管理员");
        } else {
          $("#roles", parent.document).text(roles.join('、'));
        }
      });
    }

    Date.prototype.format = function(fmt) {
      fmt = fmt || "yyyy-MM-dd hh:mm:ss";
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };



    $.fn.dataTable.ext.errMode = function(settings, tn, msg) {
      console.log(tn, msg);
    };



    window.jQuery = jQuery;
    if (targetModule) {

      require(["page/" + targetModule], function(module) {
        $.when(core.getDict()).done(function(dict) {
          // 不要在这里写业务代码，全部统一调用init方法,也就是每个模块都暴露一个init方法用于事件监听，页面内容加载等
          var data = {
            dict: dict
          };
          module.init(currentPage, data);
          initIboxTool(); //面板右上角选项卡初始化
          core.listenClick(); //点击事件监听
          initTabs(core);
        });

      });
      return;
    }

  }

  function initTabs(core) {

    var jMenusTabs = $(".J_menuTab", parent.document) || [];
    if (jMenusTabs.length > 1) {
      return;
    }
    var opentabs = core.getParentUrlQueryParams().opentabs;
    if (core.isNotEmpty(opentabs)) {
      opentabs = opentabs.split("and");
      for (var i in opentabs) {
        core.openTab(opentabs[i]);
      }
    }
  }

  function initMenus(menus) {
    var html = '';
    var temp = require("templates/common/menu");
    for (var i in menus) {
      var menu = menus[i];
      html = html + temp(menu);
    }
    $("#side-menu", parent.document).html(html);
    //如果父页面js还没有加载完毕，1秒后重新执行初始化菜单方法
    if (parent.initMenu) {
      parent.initMenu();
    } else {
      console.log("存在父窗口js没加载完毕执行子窗口js代码的情况");
      setTimeout(function() {
        initMenus(menus);
      }, 1000);
    }
  }


  /**
   * 关闭，刷新，等组件初始化
   */
  function initIboxTool() {
    var temp = require("templates/common/ibox_tool");
    if ($(".ibox-tools").first()) {
      $(".ibox-tools").first().html(temp());
    }
  }


});