// import { Zap } from "@geist-ui/icons"
// import { load } from "cheerio"
// import { load } from "react-native-cheerio"
// import cheerio from "cheerio-without-node-native"
// const cheerio = require("cheerio")
// cheerio = require('cheerio-without-node-native');
const cheerio = require('react-native-cheerio');
// const cheerio = window.cheerio;
// const cheerio = require("../src/lib/bundle.js");
// import cheerio from 'https://cdn.skypack.dev/cheerio';
import {
  createHtmlFolder,
  createHtmlFile,
  createBaseTemp,
} from "./html_config";
export class HTMLSystem {
  count = 0;
  /**
   * @name:
   * @description: 重置id
   * @return {*}
   */
  resetCount = () => {
    this.count = 0;
  };
  /**
   * @name:
   * @description: 递增id
   * @return {*}
   */
  addCount = () => {
    return this.count++;
  };


  initHTML2(html) {
    // const $ = load(html);
    const $ = cheerio.load(html);
    let dls = [];
    $("dl").each((i, e) => {
      if (e.parent.name === "body") {
        dls.push(e);
      }
    });
    // console.log("dls", dls);
    // console.log("dls.toString()", $("dl").first().toString());
    const dl = dls[0];
    // console.log("dl", dl);
    let new_arr = [];
    this.htmlToJson2(dl, new_arr, "-1");
    return new_arr;
  }

  htmlToJson2(d, l, key) {
    if (!d) {
      return;
    }
    // console.log("d", d, key)

    if (d.name === "dl" || d.name === "dt") {
      for (let i = 0; i < d.children.length; i++) {
        if ("name" in d.children[i]) {
          if (d.children[i].name === "dl") {
            // d.children[i].key = this.addCount().toString()
            this.htmlToJson2(d.children[i], l, key);
          } else if (d.children[i].name === "dt") {
            // console.log("d.children[0]", d.children[0], key)
            this.htmlToJson2(d.children[i], l, key);
          } else if (d.children[i].name === "h3") {
            // console.log("d.children[i]", d.children[i], key)
            let a = {};
            a.key = this.addCount().toString();
            a.title = d.children[i].children[0].data;
            a.parentId = key;
            l.push(a);
            key = a.key;
          } else if (d.children[i].name === "a") {
            let a = {};
            a.key = this.addCount().toString();
            a.title = d.children[i].children[0].data;
            a.parentId = key;
            a.isLeaf = true;
            a.href = d.children[i].attribs.href;
            a.name = d.children[i].children[0].data;
            l.push(a);
          }
        }
      }
    }
  }


  /**
   * @name:
   * @description: 将单个数据添加到JSON中
   * @param {Cheerio} node 父节点
   * @param {Array} list 书签JSON数据
   * @return {<Folder | File>, Array<Folder | File>, 'folder'|'file'}
   */
  addToBookMarks = (node, list = []) => {
    const item = this.getNodeTitle(node);
    const dirType = this.checkIsFileOrFolder(item);
    switch (dirType) {
      case "folder":
        item.children = [];
      case "file":
        item.key = this.addCount().toString();
        list.push(item);
        break;
    }
    return { item, list, dirType };
  };
  /**
   * @name:
   * @description: 判断单个数据是否是文件夹，并解析详细信息
   * @param {Cheerio} node 文件或文件夹所在的节点
   * @return {*}
   */
  getNodeTitle = (node) => {
    const info = {};

    const title = node.children("h3");
    // 如果h3的length为0则不是文件夹，就获取网站名称和网址，否则是文件夹并赋值title, add_date,last_modified
    return title.length === 0
      ? this.getNodeInfo(node, info)
      : {
          ...info,
          title: title.text(),
          add_date: title.attr("add_date"),
          last_modified: title.attr("last_modified"),
        };
  };
  /**
   * @name:
   * @description: 解析书签文件详细信息
   * @param {Cheerio} node 文件所在的节点
   * @return {File}
   */
  getNodeInfo = (node, info) => ({
    ...info,
    name: node.children("a").text(),
    href: node.children("a").attr("href") ?? "",
    icon: node.children("a").attr("icon") ?? "",
    add_date: node.children("a").attr("add_date"),
  });
  /**
   * @name:
   * @description: 入口函数
   * @param {Array} json 上面生成的书签JSON文件
   * @return {string}
   */
  initJSON(json) {
    return this.jsonToHtml(json);
  }

  /**
   * @name:
   * @description: 生成新标签的CheerioAPI
   * @param {string} temp 标签
   * @param {*} opt Cheerio 配置项
   * @param {*} isDoc 是否生成完整的html标签
   * @return {CheerioAPI}
   */
  createInitHtml = (
    temp,
    opt = { xml: true, xmlMode: true },
    isDoc = false
  ) => {
    // const $ = load(temp, {}, isDoc);
    const $ = cheerio.load(temp, {}, isDoc);
    return $;
  };
  /**
   * @name:
   * @description: JSON转书签的主函数
   * @param {Array} bookMarks 书签的JSON数据
   * @return {string}
   */
  jsonToHtml = (bookMarks = []) => {
    const root = this.createInitHtml(
      `<div id="root">${createBaseTemp()}</div>`
    )("#root");
    // console.log("root.children().first()", root.children().first().toString())
    bookMarks.forEach(this.createElemChild(root.children().first()));
    // console.log("root.children().toString()", root.children().toString())
    let s = root.children().toString().replaceAll("<dt/>", "<dt>");
    s = s.replaceAll("</dt>", "");
    s = s.replaceAll("\n", "");
    // s = s.replaceAll(" ", "")
    // s = s.replace(/<dt>\n*/g, "")
    s = s.replaceAll("<dl>", "\n<dl>\n");
    s = s.replaceAll("</dl>", "\n</dl>");
    s = s.replaceAll("<dt>", "\n<dt>");
    s = s.replaceAll("dl", "DL");
    s = s.replaceAll("dt", "DT");
    s = s.replaceAll("a", "A");
    s = s.replaceAll("href", "HREF");
    s = s.replaceAll("h3", "H3");
    // console.log("s", s)
    return s;
  };
  /**
   * @name:
   * @description: 递归生成Dom树
   * @param {Cheerio} node 父节点
   * @return {void}
   */
  createElemChild = (node) => (it) => {
    const type = this.checkIsFileOrFolder(it);
    switch (type) {
      case "folder":
        const folder = this.createFolder(it);
        node.append(folder("*"));
        //每次都会获取最后一个标签，将子项放进去，防止标签重复遍历
        it.children.forEach(this.createElemChild(node.children("DL").last()));
        break;
      case "file":
        const file = this.createFile(it);
        node.append(file("*"));
        break;
      case "none":
        throw new Error("Item is not Folder or File");
    }
  };
  /**
   * @name:
   * @description: 生成文件夹标签
   * @param {Folder} folder 文件夹格式的单个数据
   * @return {CheerioAPI}
   */
  createFolder = (folder) => {
    const init = this.createInitHtml(createHtmlFolder(folder));
    return init;
  };
  /**
   * @name:
   * @description: 生成文件标签
   * @param {File} file 文件格式的单个数据
   * @return {CheerioAPI}
   */
  createFile = (file) => {
    const init = this.createInitHtml(createHtmlFile(file));
    return init;
  };
  /**
   * @name:
   * @description: 判断是文件还是文件夹格式的数据
   * @param {Folder} item 单个数据
   * @return {*}
   */
  checkIsFileOrFolder = (item) => {
    if ("isLeaf" in item) {
      return "file";
    } else {
      if ("name" in item) {
        return "file";
      } else {
        return "folder";
      }
    }
  };
  // item.title ? "folder" : item.name ? "file" : "none"
  // item.isLeaf ? "file" : "folder"
}

export const htmlSystem = new HTMLSystem();
