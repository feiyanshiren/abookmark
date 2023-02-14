import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './app.less'
import { GeistProvider, CssBaseline, Button, Drawer } from '@geist-ui/core'
import { Bookmark  } from '@geist-ui/icons'
export default function App(props) {

  const [state, setState] = useState(false)
   
    return (
      <GeistProvider>
        <CssBaseline />

        <div className="Book-hide">
            <Button
              ghost auto scale={0.5}
              icon={<Bookmark  />}
              onClick={() => setState(true)}
              >
            </Button>
        </div>
        <div>
          <Drawer visible={state} onClose={() => setState(false)} placement="bottom"
          height={"600px"}
          >
          {/* <Drawer.Title>标题</Drawer.Title>
          <Drawer.Subtitle>子标题</Drawer.Subtitle> */}
          <Drawer.Content
          
          >
            <p>Geist UI 是我最爱的组件库。</p>
          </Drawer.Content>
          </Drawer>
        </div>


      </GeistProvider>
    )
  
}
