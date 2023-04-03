/**
 * @name:
 * @description: 书签默认模板
 * @param {string} 书签名
 * @return {*}
 */
 export const createHtmlTemp = name => `<!DOCTYPE NETSCAPE-Bookmark-file-1>
 <!-- This is an automatically generated file.
      It will be read and overwritten.
      DO NOT EDIT! -->
 <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
 <TITLE>${name}</TITLE>
 <H1>${name}</H1>
 `
 /**
  * @name:
  * @description: 生成文件夹格式的Dom
  * @param {Folder} folder 文件夹格式数据
  * @return {*}
  */
 export const createHtmlFolder = folder => `
 <DT/>
 <H3 ADD_DATE="${folder.add_date}" LAST_MODIFIED="${folder.last_modified}">${
   folder.title
 }</H3>
 ${createBaseTemp()}
 `
 /**
  * @name:
  * @description: 生成文件格式的Dom
  * @param {File} file 文件格式数据
  * @return {*}
  */
 export const createHtmlFile = file => `
 <DT/>
 <A HREF="${file.href}" ICON="${file.icon}" ADD_DATE="${file.add_date}">${file.name}</A>
 `
 /**
  * @name:
  * @description: 列表格式的Dom
  * @return {*}
  */
 export const createBaseTemp = () => `
 <DL><p>
 </DL><p>
 `
 