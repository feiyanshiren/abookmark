import React from 'react'
import { useState} from 'react'  // useEffect, useRef 
import './app.less'
import { GeistProvider, CssBaseline, Button, Drawer, Grid, Spacer, Tree } from '@geist-ui/core'
import { Bookmark, Settings, PlusSquare, Star  } from '@geist-ui/icons'
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

          <Drawer.Content
          
          >
            <Grid.Container >
                <Grid xs={6}>
                  <Button  auto scale={0.5} icon={<Settings />}></Button>
                </Grid>
                <Grid xs={6}>
                  <Button  auto scale={0.5} icon={<PlusSquare />}></Button>
                </Grid>
                <Grid xs={6}>
                  <Button  auto scale={0.5} icon={<Star />}></Button>
                </Grid>
                <Grid xs={6}>
                </Grid>
                <Spacer h={2}/>
                <Grid xs={24}>
                  <Tree 
                    value={markData}
                    initialExpand={true}
                    onClick={onClickTree} 
                    />
                </Grid>
            </Grid.Container>
          </Drawer.Content>
          </Drawer>
        </div>


      </GeistProvider>
    )
  
}
