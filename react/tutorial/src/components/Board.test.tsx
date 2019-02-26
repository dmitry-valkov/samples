import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React = require('react');
import { Board } from './Board';
import { Square } from './Square';


describe('Board', () => {
  it('should render correctly', () => {
    const output = shallow(
      <Board />
    );

    expect(shallowToJson(output)).toMatchSnapshot();
  });

  it('should render 9 Squares', () => {
    const output = shallow(
      <Board />
    );

    expect(output.find(Square)).toHaveLength(9);
  });

  it('should right change state after Square click', () => {
    const output = shallow(
      <Board />
    );

    expect(output.state('squares')).toEqual([null, null, null, null, null, null, null, null, null]);
    expect(output.state('xIsNext')).toBe(true);

    output.find(Square).first().simulate('click');

    expect(output.state('squares')).toEqual(['X', null, null, null, null, null, null, null, null]);
    expect(output.state('xIsNext')).toBe(false);

    output.find(Square).at(1).simulate('click');

    expect(output.state('squares')).toEqual(['X', 'O', null, null, null, null, null, null, null]);
    expect(output.state('xIsNext')).toBe(true);

  });
});