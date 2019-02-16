import React from 'react';
import { Grid, Loader } from 'semantic-ui-react';

import ToolCard from './ToolCard';

export default class ToolsList extends React.Component {
  

  render() {
    let { tools } = this.props;
    let toolsLeft = [];
    let toolsRight = [];
    
    tools.forEach((tool, i) => {
      i % 2 === 0 
        ? toolsLeft.push(tool)
        : toolsRight.push(tool)
    });
    
    return (
      <Grid>
        <Grid.Row style={{paddingTop: '0'}}>        
          <Grid.Column width={8} style={{ padding:'7px', paddingRight: '3.5px' }}> 
          {
            toolsLeft.map((tool, i) => (
              <ToolCard key={`tool-left-${i}`} tool={tool} />
            ))
          }
          </Grid.Column>
          <Grid.Column width={8} style={{ padding:'7px', paddingLeft: '3.5px' }}> 
          {
            toolsRight.map((tool, i) => (
              <ToolCard key={`tool-right-${i}`} tool={tool} />
            ))
          }
          </Grid.Column>     

        </Grid.Row>
      </Grid>
    );
  }
}