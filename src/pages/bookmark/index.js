import React from 'react'
import { useState} from 'react'  // useEffect, useRef 
import './index.less'
import { BookOutlined, SettingOutlined, StarOutlined, MinusOutlined, PlusOutlined, EditOutlined} from '@ant-design/icons'; //PlusSquareOutlined
import { Button, Drawer, Space, Tree } from 'antd';

export default function BookMark(props){
    const { DirectoryTree } = Tree;
    const [state, setState] = useState(false)
  
    const onClose = () => {
      setState(false);
    };
  
  //默认一维数组
  const statictreedata = [
    {
        key: '1',
        title: 'root',
        parentId: '0'
    },
    {
      key: '2',
      title: '2',
      parentId: '1',
      isLeaf: true
  },
  ]
  
  
  //一维数组转多维
  function returnTree(arr) {
    function recursionFun(temparr, key) {
        let tree = []
        temparr.forEach(item => {
            if (key === item.parentId){
                tree.push({
                    ...item,
                    children: recursionFun(arr, item.key)
                })
            }
        })
        return tree
    }
  
    return recursionFun(arr, '0')
  }
  
    const onSelect = (keys, info) => {
      console.log('Trigger Select', keys, info);
    };
    // const onExpand = (keys, info) => {
    //   console.log('Trigger Expand', keys, info);
    // };
  
    const [markData, setMarkData] = useState(statictreedata)
  
  
    //自定义treetitle展示
  function titleRender({ title, key, isLeaf }) {
    console.log(title, key, isLeaf);
    return <>
  
        <span>{title}</span>
        {key != "1"?(
          <MinusOutlined className='to_right'  onClick={() => { 
            //业务的处理函数
            //在这里处理拿到key 去处理一维数组，然后再转二维数组 ，再setState
          }} />
        ):""}
        {isLeaf??(
          <PlusOutlined className='to_right' onClick={() => { 
            //业务的处理函数
            //在这里处理拿到key 去处理一维数组，然后再转二维数组 ，再setState
          }} />
        )}
        
  
        <EditOutlined className='to_right'/>
  
    </>
  }
     
      return (
        <>

      <div className="Book-hide">
                  <Button
                    // type="primary"
                    icon={<BookOutlined />}
                    onClick={() => setState(true)}
                    >
                  </Button>
        </div>
     
          <Drawer
            // title="Basic Drawer"
            placement={"bottom"}
            // closable={false}
            onClose={onClose}
            open={state}
            // key={placement}
            extra={
              <Space>
                {/* <Button icon={<PlusSquareOutlined />}></Button> */}
                <Button icon={<StarOutlined />}></Button>
                <Button icon={<SettingOutlined />}></Button>
              </Space>
            }
          >
            <DirectoryTree
              multiple={false}
              defaultExpandAll
              onSelect={onSelect}
              // onExpand={onExpand}
              treeData={returnTree(markData)}
              titleRender={titleRender}
              expandAction={false}
            />
          </Drawer>
       
  
        </>
      )
}