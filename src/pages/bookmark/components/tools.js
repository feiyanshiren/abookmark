
export const webdav = {
    Account: "",
    Password: "",

    NewFolder: function (FolderName) {
        let url = `https://dav.jianguoyun.com/dav/${FolderName}/`
        let type = "MKCOL"
        let header = { "authorization": `Basic ${btoa(this.Account + ':' + this.Password)}` }
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    timeout: 3000,
                    headers: header,
                    url: url,
                    onload: complete,
                    onerror: error,
                    ontimeout: error
                })
            }
        )
    },
    UploadFiles: function (FolderName, FileName, FileData, DataType) {
        let url = `https://dav.jianguoyun.com/dav/${FolderName}/${FileName}`
        let type = "PUT"
        let header = { "authorization": `Basic ${btoa(this.Account + ':' + this.Password)}` }
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    timeout: 3000,
                    data: FileData,
                    headers: header,
                    url: url,
                    dataType: DataType,
                    onload: complete,
                    onerror: error,
                    ontimeout: error
                })
            }
        )
    },
    DownloadAFile: function (FolderName, FileName) {
        let url = `https://dav.jianguoyun.com/dav/${FolderName}/${FileName}`
        let type = "GET"
        let header = { "authorization": `Basic ${btoa(this.Account + ':' + this.Password)}` }
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    timeout: 3000,
                    headers: header,
                    url: url,
                    onload: complete,
                    onerror: error,
                    ontimeout: error
                })
            }
        )
    },
    GetAllFile: function (path, depth) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PROPFIND",
                url: "https://dav.jianguoyun.com/dav/" + path,
                headers: {
                    "Authorization": `Basic ${btoa(this.Account + ':' + this.Password)}`,
                    "Depth": depth
                },
                onload: function (response) {
                    if (response.status == 207) {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                        var responses = xmlDoc.getElementsByTagNameNS("DAV:", "response");
                        var urls = [];
                        for (var i = 0; i < responses.length; i++) {
                            var href = responses[i].getElementsByTagNameNS("DAV:", "href")[0].textContent;
                            var propstat = responses[i].getElementsByTagNameNS("DAV:", "propstat")[0];
                            var status = propstat.getElementsByTagNameNS("DAV:", "status")[0].textContent;
                            if (status.includes("200 OK")) {
                                var resourcetype = propstat.getElementsByTagNameNS("DAV:", "resourcetype")[0];
                                if (resourcetype.getElementsByTagNameNS("DAV:", "collection").length > 0) {
                                    href += "/";
                                }
                                urls.push(href);
                            }
                        }
                        resolve(urls);
                    }
                    else {
                        console.error(response);
                        reject(new Error("The request failed with status code " + response.status));
                    }
                }
            });
        });
    },
    ExistsFile: function (path) {
        
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "HEAD",
                url: "https://dav.jianguoyun.com/dav/" + path,
                headers: {
                    "Authorization": `Basic ${btoa(this.Account + ':' + this.Password)}`
                },
                onload: function (response) {
                    var status = response.status;
                    // 如果状态码是200，表示文件夹存在
                    if (status == 200) {
                        resolve(true)
                    }
                    // 如果状态码是404，表示文件夹不存在
                    else if (status == 404) {
                        resolve(false)
                    } else if (status == 403) {
                        resolve(false)
                        reject("权限不足,拒绝访问")
                    }
                    else {
                        reject("The status code is " + status + " and the status text is " + response.statusText)
                    }
                    console.log("response", response)
                }
            });
        }
        )
    }
  }
//   webdav.ExistsFile('debug').then(
//     async r => {
//         if (!r) {//不存在
//             await webdav.NewFolder('debug')
//         }
//         console.log(await webdav.UploadFiles('debug', 'hi.js', "{js:'hi'}", "json"));
//     }
//   )