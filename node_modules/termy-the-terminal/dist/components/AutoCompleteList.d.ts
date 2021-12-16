import React from 'react';
export interface AutoCompleteList {
    [index: string]: {
        type: 'FOLDER' | 'FILE';
    };
}
interface AutoCompleteListProps {
    items: AutoCompleteList;
    activeItemIndex?: number;
}
declare const AutoCompleteList: React.FC<AutoCompleteListProps>;
export default AutoCompleteList;
