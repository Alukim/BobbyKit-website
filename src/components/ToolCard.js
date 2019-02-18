import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';

import '../styles/ToolCard.scss';

let blue = '#0079DB';
let yellow = '#FFC100';

export default class ToolCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '/images/tools.jpg',
    };
  }
  render() {

    const { tool, update } = this.props;
    console.log(this.props)
    console.log(tool.imageId)
    console.log(update)

    let cardHref = update === false ? `/tool/${tool.id}` :`/tool/${tool.id}`
    return (
      <Card href={cardHref} fluid style={{ margin: '7px 0' }}>
        <Image src={tool.imageId ? `${BASE_API_URL}/image/${tool.imageId}` : '/images/tools.jpg'} />
        <Card.Content>
          <Card.Header><span className="truncated" style={{fontSize: '1.1rem'}}>{tool.name}</span></Card.Header>
          <Card.Meta>
            <span className='date'>{tool.city}&nbsp;&#8231;&nbsp;{tool.createdAt.split("T")[0]}</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Icon name='credit card' style={{marginRight: '10px'}}/>
          <span style={{color: blue}}>{ tool.pricePerDay } zł</span> / dzień
        </Card.Content>
      </Card>
    );
  }
}