import * as React from 'react';
import './FlexList.scss';

interface FlexListProps {
  listItems: any[];
  componentToMap: any;
}

export const FlexList: React.SFC<FlexListProps> = ({listItems, componentToMap}) => {
  const Component = componentToMap;
  return (
    <div className="flex-list__list">
      {
        listItems.map((item, index) => (
          <div key={`flex-item-${index}`} className="flex-list__list-item">
            <Component {...item} />
          </div>
        ))
      }
    </div>
  );
};