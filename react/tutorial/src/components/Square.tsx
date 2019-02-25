import React = require("react");

export interface SquareBoard {
    value: string,
    onClick: () => void
}

export class Square extends React.Component {
    constructor(public props: SquareBoard) {
        super(props);
    }

    render() {
        return (
            <button className='square' onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}