import './group-assessment-list.styl';

import React, { Component } from 'react';
import fecha from 'fecha';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteUserGroupAssessmentById } from 'actions/user-group-assessment-actions';

import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class List extends Component {
  static propTypes = {
    data: React.PropTypes.array,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static defaultProps = {
    data: [],
  };

  state = {};

  actionsReviewResolver = (id) => {
    const isAdmin = this.props.user.admin;

    if (isAdmin) {
      return (
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem
            primaryText="View"
            onClick={this.createGoToViewHandler(id)}
          />

          <MenuItem
            primaryText="Edit"
            onClick={this.createGoToEditHandler(id)}
          />

          <MenuItem
            primaryText="Delete"
            onClick={this.deleteRecordHandler(id)}
          />
        </IconMenu>
      );
    }

    return (
      <RaisedButton
        style={{ display: 'flex', 'align-self': 'center' }}
        primary
        label="Open"
        onClick={this.createGoToViewHandler(id)}
      />
    );
  };

  createGoToEditHandler = (id) => () => {
    const slug = this.props.organization.slug;

    this.context.router.push(`/${slug}/group-assessment/${id}/edit`);
  };

  createGoToViewHandler = (id) => () => {
    const slug = this.props.organization.slug;

    this.context.router.push(`/${slug}/group-assessment/${id}`);
  };

  deleteRecordHandler = (id) => () => {
    this.props.deleteUserGroupAssessmentById(id)
      .then(() => this.props.reload());
  };

  /**
   * @param types {Array}
   */
  createPersonalityTypesText = (types = []) =>
    types.map((type, index) => {
      const isLastItem = (types.length - 1) === index;
      let syntax = ', ';

      if (isLastItem) syntax = '';

      return (
        <span key={index}>{type}{syntax}</span>
      );
    });

  /**
   * @param item {Object}
   * @param i {Number}
   */
  createListItem = (item, i) => (
    <div key={i} className="list-item">
      <div className="list-item__description">
        <div><span className="list-item__label">Assessment</span>: {item.assessment.title}</div>

        <div className="list-item__extra">

          <If condition={item.personalityTypes && item.personalityTypes.length}>
            <div>
              <span className="list-item__label">For</span>{': '}
              {this.createPersonalityTypesText(item.personalityTypes)}
            </div>
          </If>

          <div><span className="list-item__label">From</span>: {fecha.format(new Date(item.start), 'MM/DD/YY h:mm a')}</div>

          <div><span className="list-item__label">To</span>: {fecha.format(new Date(item.end), 'MM/DD/YY h:mm a')}</div>
        </div>
      </div>

      {this.actionsReviewResolver(item.id)}
    </div>
  );

  render() {
    return (
      <div className="group-assessment__list">
        <If condition={this.props.data.length > 0}>
          {this.props.data.map((item, i) => this.createListItem(item, i))}

          <Else />

          <If condition={this.props.user.admin}>
            <div className="empty">Click add button to create a new User Group Assessment</div>

            <Else/>

            <div className="empty">No User Group Assessment currently</div>
          </If>
        </If>
      </div>
    );
  }
}

const selector = createSelector(
  [
    state => state.user,
    state => state.organization,
  ],
  (user, organization) => ({ user, organization })
);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  deleteUserGroupAssessmentById,
}, dispatch);

export default connect(selector, mapDispatchToProps)(List);
