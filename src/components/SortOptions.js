import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

let blue = '#0079DB';
let yellow = '#FFC100';

export default function SortOptions({activeItem = 'latest', handleItemClick = ()=>{}}) {
	return (
		<div>
			<div style={{textAlign: 'center', marginBottom: '10px', fontWeight: 'bold'}}>Opcje sortowania:</div>
			<Menu vertical>
				<Menu.Item name='inbox' active={activeItem === 'least-expensive'} onClick={handleItemClick}>
					<Icon name="dollar" color="black"/>
					<Icon name="sort ascending" color="black"/>
					Najtańsze
				</Menu.Item>

				<Menu.Item name='spam' active={activeItem === 'most-expensive'} onClick={handleItemClick}>
					<Icon name="dollar" color="black"/>
					<Icon name="sort descending" color="black"/>
					Najdroższe
				</Menu.Item>

				<Menu.Item name='updates' active={activeItem === 'latest'} onClick={handleItemClick}>
					<Icon name="calendar" color="black"/>
					Najnowsze
				</Menu.Item>
			</Menu>
		</div>
	);
}