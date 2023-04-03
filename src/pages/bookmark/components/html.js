/*
 * @Author: Hunter
 * @Date: 2022-03-12 13:48:04
 * @LastEditTime: 2022-12-05 23:31:03
 * @LastEditors: Hunter
 * @Description:
 * @FilePath: \book_mark_private\src\utils\html.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */

import { load } from "cheerio"
import { createHtmlFolder, createHtmlFile, createBaseTemp } from "./html_config"
export class HTMLSystem {
  count = 0
  /**
   * @name:
   * @description: 重置id
   * @return {*}
   */
  resetCount = () => {
    this.count = 0
  }
  /**
   * @name:
   * @description: 递增id
   * @return {*}
   */
  addCount = () => {
    return this.count++
  }
  /**
   * @name:
   * @description: 初始化html生成器
   * @param {string} html 预加载的html字符文件
   * @return {Array<Folder | File>}
   */
  initHTML(html) {
    const $ = load(html)
    const dl = $("dl").first()
    const dt = dl.children("dt").eq(0)
    return this.htmlToJson(dt, [])
  }

  /**
   * @name:
   * @description: html转Json的递归函数
   * @param {Cheerio} node 根节点
   * @param {Array} bookMarks JSON数据源
   * @return {Array<Folder | File>}
   */
  htmlToJson = (node, bookMarks = []) => {
    //下一级文件夹目录列表
    const childrenNodeDL = node.children("dl")
    const childrenNodeDT = childrenNodeDL.children("dt")
    const { item: dir, dirType } = this.addToBookMarks(node, bookMarks)
    childrenNodeDT.map(i => {
      const it = childrenNodeDT.eq(i)
      dirType === "file" && this.addToBookMarks(it, dir.children)
      this.htmlToJson(it, dir.children)
    })
    return bookMarks
  }
  /**
   * @name:
   * @description: 将单个数据添加到JSON中
   * @param {Cheerio} node 父节点
   * @param {Array} list 书签JSON数据
   * @return {<Folder | File>, Array<Folder | File>, 'folder'|'file'}
   */
  addToBookMarks = (node, list = []) => {
    const item = this.getNodeTitle(node)
    const dirType = this.checkIsFileOrFolder(item)
    switch (dirType) {
      case "folder":
        item.children = []
      case "file":
        item.id = this.addCount().toString()
        list.push(item)
        break
    }
    return { item, list, dirType }
  }
  /**
   * @name:
   * @description: 判断单个数据是否是文件夹，并解析详细信息
   * @param {Cheerio} node 文件或文件夹所在的节点
   * @return {*}
   */
  getNodeTitle = node => {
    const info = {}

    const title = node.children("h3")
    // 如果h3的length为0则不是文件夹，就获取网站名称和网址，否则是文件夹并赋值title, add_date,last_modified
    return title.length === 0
      ? this.getNodeInfo(node, info)
      : {
          ...info,
          title: title.text(),
          add_date: title.attr("add_date"),
          last_modified: title.attr("last_modified")
        }
  }
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
    add_date: node.children("a").attr("add_date")
  })
  /**
   * @name:
   * @description: 入口函数
   * @param {Array} json 上面生成的书签JSON文件
   * @return {string}
   */
  initJSON(json) {
    return this.jsonToHtml(json)
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
    const $ = load(temp, opt, isDoc)
    return $
  }
  /**
   * @name:
   * @description: JSON转书签的主函数
   * @param {Array} bookMarks 书签的JSON数据
   * @return {string}
   */
  jsonToHtml = (bookMarks = []) => {
    const root = this.createInitHtml(
      `<div id="root">${createBaseTemp()}</div>`
    )("#root")
    bookMarks.forEach(this.createElemChild(root.children().first()))
    return root.children().toString()
  }
  /**
   * @name:
   * @description: 递归生成Dom树
   * @param {Cheerio} node 父节点
   * @return {void}
   */
  createElemChild = node => it => {
    const type = this.checkIsFileOrFolder(it)
    switch (type) {
      case "folder":
        const folder = this.createFolder(it)
        node.append(folder("*"))
        //每次都会获取最后一个标签，将子项放进去，防止标签重复遍历
        it.children.forEach(this.createElemChild(node.children("DL").last()))
        break
      case "file":
        const file = this.createFile(it)
        node.append(file("*"))
        break
      case "none":
        throw new Error("Item is not Folder or File")
    }
  }
  /**
   * @name:
   * @description: 生成文件夹标签
   * @param {Folder} folder 文件夹格式的单个数据
   * @return {CheerioAPI}
   */
  createFolder = folder => {
    const init = this.createInitHtml(createHtmlFolder(folder))
    return init
  }
  /**
   * @name:
   * @description: 生成文件标签
   * @param {File} file 文件格式的单个数据
   * @return {CheerioAPI}
   */
  createFile = file => {
    const init = this.createInitHtml(createHtmlFile(file))
    return init
  }
  /**
   * @name:
   * @description: 判断是文件还是文件夹格式的数据
   * @param {Folder} item 单个数据
   * @return {*}
   */
  checkIsFileOrFolder = item =>
    item.title ? "folder" : item.name ? "file" : "none"
}

export const htmlSystem = new HTMLSystem()
