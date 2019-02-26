import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Square } from './Square';
import React = require('react');


describe('Square', () => {
  it('should render correctly', () => {
    const output = shallow(
      <Square value='X' onClick={() => {}} />
    );

    expect(shallowToJson(output)).toMatchSnapshot();
  });

  it('should handle the click event', () => {
    const logText = 'Square handle click test';
    console.log = jest.fn();

    const output = shallow(
      <Square value='X' onClick={() => console.log(logText)} />
    );

    output.simulate('click');
    expect(console.log).toHaveBeenCalledWith(logText);
  });
});