import React from 'react'
import { useState} from 'react'  // useEffect, useRef 
import './app.less'
import { BookOutlined } from '@ant-design/icons';
import { Button } from 'antd';
export default function App(props) {

  const [state, setState] = useState(false)

  



  const onClickTree = (path) => {
    console.log("paht", path);
  };

  const files = [{
    type: 'directory',
    name: 'bin',
    files: [{
      type: 'file',
      name: 'cs.js',
    }],
  }, {
    type: 'directory',
    name: 'docs',
    files: [{
      type: 'file',
      name: 'controllers.md',
    }, {
      type: 'file',
      name: 'es6.md',
    }, {
      type: 'file',
      name: 'production.md',
    }, {
      type: 'file',
      name: 'views.md',
    }],
  }]

  const [markData, setMarkData] = useState(files)
   
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

      </>
    )
  
}
