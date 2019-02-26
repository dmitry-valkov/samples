import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React = require('react');
import { Game } from './Game';

describe('Game', () => {
  it('should render correctly', () => {
    const output = shallow(
      <Game />
    );

    expect(shallowToJson(output)).toMatchSnapshot();
  });
});