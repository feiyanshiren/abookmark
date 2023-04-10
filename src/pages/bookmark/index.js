import React from "react";
import { useState } from "react";
import "./index.less";
import {
  BookOutlined,
  SettingOutlined,
  StarOutlined,
  MinusOutlined,
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons"; 
import {
  Button,
  Drawer,
  Space,
  Tree,
  Modal,
  Input,
  Popconfirm,
  Upload,
  List,
} from "antd";
import { htmlSystem } from "./components/html";
import { createHtmlTemp } from "./components/html_config";
import { webdav } from "./components/tools";

export default function BookMark(props) {
  const { DirectoryTree } = Tree;
  const [state_Drawer, setState_Drawer] = useState(false);
  const [openAddFolder, setOpenAddFolder] = useState(false);
  const [openAddFolder_input, setOpenAddFolder_input] = useState("");
  const [current_select_key, setCurrent_select_key] = useState("1");
  const [current_type, setCurrent_type] = useState("add");
  const [open_webdav, setOpen_webdav] = useState(false);
  const [webdav_username, setWebdav_username] = useState("");
  const [webdav_password, setWebdav_password] = useState("");
  const [webdav_url, setWebdav_url] = useState("");

  //默认一维数组
  const statictreedata = [
    {
      key: "1",
      title: "root",
      parentId: "-1",
    },
    {
      key: "2",
      title: "2",
      parentId: "1",
      isLeaf: true,
      href: "HTTP://WWW.BAIDU.COM",
      name: "2",
    },
  ];

  const [markData, setMarkData] = useState(statictreedata);

  const drawer_onClose = () => {
    setState_Drawer(false);
  };

  //一维数组转多维
  function returnTree(arr) {
    function recursionFun(temparr, key) {
      let tree = [];
      temparr.forEach((item) => {
        if (key === item.parentId) {
          tree.push({
            ...item,
            children: recursionFun(arr, item.key),
          });
        }
      });
      return tree;
    }

    return recursionFun(arr, "-1");
  }

  // 多维数组转一维
  //Object.keys(the_data).length === 0
  function returnArr(tree, arr, key) {
    if (Array.isArray(tree)) {
      for (let i = 0; i < tree.length; i++) {
        let a = { ...tree[i] };
        // a.key = a.id;
        a.parentId = key;
        if (!("title" in a)) {
          a.title = a.name;
        }
        if ("href" in a) {
          a.isLeaf = true;
          // a.url = a.href;
        }
        if ("icon" in a) {
          delete a.icon;
        }
        let c = a.children;
        delete a.children;

        arr.push(a);

        returnArr(c, arr, a.key);
      }
    }
  }

  const onSelect = (keys, info) => {
    // console.log('Trigger Select', keys, info);
    setCurrent_select_key(keys[0]);
  };

  const to_onDoubleClick = (keys, info) => {
    // console.log('Trigger Select', keys, info);
    if (info.isLeaf) {
      setCurrent_select_key(keys[0]);
      window.open(info.href);
    }
  };

  //自定义treetitle展示
  function titleRender({ title, key, isLeaf, parentId }) {
    // console.log(title, key, isLeaf, parentId);
    return (
      <>
        <span>{title}</span>
        {parentId != "-1" ? (
          <>
            <Popconfirm
              title="Xxxx"
              description="Xxxxxxxxxx?"
              onConfirm={(e) => {
                setMarkData(
                  markData.filter(
                    (value) => value.key !== key && value.parentId !== key
                  )
                );
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <MinusOutlined className="to_right" />
            </Popconfirm>
          </>
        ) : (
          ""
        )}
        {isLeaf ?? (
          <PlusOutlined
            className="to_right"
            onClick={() => {
              //业务的处理函数
              //在这里处理拿到key 去处理一维数组，然后再转二维数组 ，再setState
              setOpenAddFolder_input("");
              setCurrent_type("add");
              setOpenAddFolder(true);
            }}
          />
        )}

        <EditOutlined
          className="to_right"
          onClick={() => {
            setOpenAddFolder_input(title);
            setCurrent_type("edit");
            setOpenAddFolder(true);
          }}
        />
      </>
    );
  }

  const open_webdav_handleOk = async (v) => {
    // console.log("v", webdav_username, webdav_password)
    webdav.ExistsFile("YueDu/vcards_20230107_134557.vcf").then(async (r) => {
      console.log("r", r);
    });
  };

  const openAddFolder_handleOk = (v) => {
    // console.log("v", v.target.value);
    if (openAddFolder_input != "") {
      if (current_type === "add") {
        setMarkData([
          ...markData,
          {
            key: +new Date() + Math.random() + "",
            title: openAddFolder_input,
            parentId: current_select_key,
          },
        ]);
      } else {
        let the_data = [...markData];
        the_data = the_data.map((v) => {
          if (v.key === current_select_key) {
            v.title = openAddFolder_input;
          }
          return v;
        });
        setMarkData(the_data);
      }

    }

    setOpenAddFolder(false);
  };
  const openAddFolder_handleCancel = () => {
    setOpenAddFolder(false);
  };

  const open_webdav_handleCancel = () => {
    setOpen_webdav(false);
  };

  const openAddFolder_onChange = (v) => {
    // console.log("v", v.target.value);
    setOpenAddFolder_input(v.target.value);
  };

  const webdav_username_onChange = (v) => {
    // console.log("v", v.target.value);
    setWebdav_username(v.target.value);
  };

  const webdav_url_onChange = (v) => {
    // console.log("v", v.target.value);
    setWebdav_url(v.target.value);
  };
  

  const webdav_password_onChange = (v) => {
    // console.log("v", v.target.value);
    setWebdav_password(v.target.value);
  };

  const to_onDrop = (info) => {
    // console.log("info", info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // console.log("dropKey", dropKey, dragKey, dropPos, dropPosition);
    //root 拖拽不动
    if (dropKey === "1" && dropPosition != 0) {
      return;
    }
    let drag_data = [];
    let index = -1;
    let drop_data = {};
    let the_data = [];

    //两次循环保证顺序
    for (let i = 0; i < markData.length; i++) {
      if (dragKey === markData[i].key) {
        drag_data.push(markData[i]);
        break;
      }
    }
    for (let i = 0; i < markData.length; i++) {
      if (dragKey === markData[i].parentId) {
        drag_data.push(markData[i]);
      }
    }
    for (let i = 0; i < markData.length; i++) {
      if (dragKey !== markData[i].parentId && dragKey !== markData[i].key) {
        the_data.push(markData[i]);
      }
    }

    for (let i = 0; i < the_data.length; i++) {
      if (the_data[i].key === dropKey) {
        index = i;
        drop_data = the_data[i];
        break;
      }
    }

    // let the_data = [...markData];

    if (index != -1) {
      if (dropPosition == 0) {
        drag_data[0].parentId = drop_data.key;
        the_data.splice(index + 1, 0, ...drag_data);
      } else if (dropPosition == 1) {
        drag_data[0].parentId = drop_data.parentId;
        the_data.splice(index + 1, 0, ...drag_data);
      } else if (dropPosition == -1) {
        drag_data[0].parentId = drop_data.parentId;
        the_data.splice(index, 0, ...drag_data);
      }

      setMarkData(the_data);
    }

    // console.log("drag_data", drag_data, index);
  };

  const open_book = () => {
    // console.log("getCurrentPages", document.location.href, document.title);
    setState_Drawer(true);
  };

  const to_star = () => {
    // console.log("current_select_key", current_select_key);
    let the_data = {};
    for (let i = 0; i < markData.length; i++) {
      if (current_select_key === markData[i].key) {
        the_data = markData[i];
        break;
      }
    }
    // console.log("the_data === {}", Object.keys(the_data).length === 0);

    let a_data = {
      key: +new Date() + Math.random() + "",
      title: document.title,
      parentId: current_select_key,
      isLeaf: true,
      // url: document.location.href,
      href: document.location.href,
    };
    if (the_data.isLeaf) {
      a_data.parentId = the_data.parentId;
    }
    //修补删除后无法添加的bug
    if (Object.keys(the_data).length === 0) {
      the_data = markData[0];
      setCurrent_select_key("1");
      a_data.parentId = "1";
    }

    setMarkData([a_data, ...markData]);
  };

  // const to_upload = () =>{

  // };

  function downloadFile(url, name = "bookmark.html") {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    const _evt = new MouseEvent("click");
    link.dispatchEvent(_evt);
  }

  function stringToBlobURL(fileString) {
    return URL.createObjectURL(
      new Blob([fileString], { type: "application/octet-stream" })
    );
  }

  const to_download = () => {
    // recursionFun(arr, "-1")

    const bookmarks = returnTree(markData);
    // console.log("bookmarks", bookmarks);
    const htmlStr = htmlSystem.initJSON(bookmarks);
    // console.log("htmlStr", htmlStr);
    const htmlTemp = createHtmlTemp("bookmark");
    // console.log("htmlTemp", htmlTemp);
    const targetFile = stringToBlobURL(htmlTemp + htmlStr);
    // console.log("targetFile", targetFile);
    downloadFile(targetFile, "bookmarks.html");
  };

  const getTextInfo = (file) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (result) => {
      const htmljson = htmlSystem.initHTML2(result.target.result);

      setMarkData(htmljson);
    };
    return false;
  };

  return (
    <>
      <Modal
        title="webdav"
        open={open_webdav}
        onOk={open_webdav_handleOk}
        onCancel={open_webdav_handleCancel}
      >
        <Input
          onChange={webdav_url_onChange}
          value={webdav_url}
          placeholder="url"
        />
        <Input
          onChange={webdav_username_onChange}
          value={webdav_username}
          placeholder="username"
        />
        <Input.Password
          onChange={webdav_password_onChange}
          value={webdav_password}
          placeholder="password"
        />
      </Modal>

      <Modal
        title="---"
        open={openAddFolder}
        onOk={openAddFolder_handleOk}
        onCancel={openAddFolder_handleCancel}
      >
        <Input onChange={openAddFolder_onChange} value={openAddFolder_input} />
      </Modal>

      <div className="Book-hide">
        <Button
          // type="primary"
          icon={<BookOutlined />}
          onClick={open_book}
        ></Button>
      </div>

      <Drawer
        // title="Basic Drawer"
        placement={"bottom"}
        // closable={false}
        onClose={drawer_onClose}
        open={state_Drawer}
        // key={placement}
        extra={
          <Space>
            {/* <Button icon={<PlusSquareOutlined />}></Button> */}
            <Button icon={<StarOutlined />} onClick={to_star}></Button>
            <Button
              icon={<SettingOutlined />}
              onClick={() => {
                setOpen_webdav(true);
              }}
            ></Button>

            <Upload
              accept=".html"
              beforeUpload={getTextInfo}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}></Button>
            </Upload>

            <Button icon={<DownloadOutlined />} onClick={to_download}></Button>
          </Space>
        }
      >
        <DirectoryTree
          multiple={false}
          // autoExpandParent = {true}
          defaultExpandAll
          onSelect={onSelect}
          // onExpand={onExpand}
          onDoubleClick={to_onDoubleClick}
          treeData={returnTree(markData)}
          titleRender={titleRender}
          expandAction={false}
          draggable={{ icon: false }}
          onDrop={to_onDrop}
          // icon={false}
        />
      </Drawer>
    </>
  );
}
