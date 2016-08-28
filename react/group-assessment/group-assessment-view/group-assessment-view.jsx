import './group-assessment-view.styl';

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fecha from 'fecha';

import {
  getUserGroupAssessmentById,
  clearUserGroupAssessment,
} from 'actions/user-group-assessment-actions';

import { TitledBox } from 'sheri';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/editor/mode-edit';

function formatDate(stringDate) {
  return fecha.format(new Date(stringDate), 'MM/DD/YY h:mm a');
}

class View extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  state = {
    pageTitle: 'User Group Assessment',
    loading: true,
  };

  componentDidMount() {
    const id = this.props.params.id;

    this.props.getUserGroupAssessmentById(id, ['assessment'])
      .then(() => this.setState({ loading: false }));
  }

  componentWillUnmount() {
    this.props.clearUserGroupAssessment();
  }

  createPersonalityTypesList = (list) =>
    list.map((type, i) => <div className="pill" key={i}>{type}</div>);

  createOnClickEditHandler = (id) => () => {
    const slug = this.props.organization.slug;

    this.context.router.push(`/${slug}/group-assessment/${id}/edit`);
  };

  render() {
    const record = this.props.userGroupAssessment;

    const actions = this.props.user.admin ?
      (<div className="task-actions">
        <IconButton
          iconStyle={{ fill: '#fff' }}
          className="hint--bottom hint--black"
          data-hint="Edit"
          onClick={this.createOnClickEditHandler(this.props.params.id)}
        >
          <Edit />
        </IconButton>
      </div>)
      : null;

    return (
      <div className="group-assessment__view">
        <Helmet title={this.state.pageTitle} />

        <TitledBox
          title={this.state.pageTitle}
          actions={actions}
        >
          <If condition={this.state.loading}>
            <div className="loading">Loading...</div>

            <Else />

            <div className="view">
              <div className="field">
                <div className="label">Assessment:</div>
                <div className="value">{record.assessment.title}</div>
              </div>

              <div className="field field--pills">
                <div className="label">Personality types:</div>
                <div className="value">
                  {this.createPersonalityTypesList(record.personalityTypes)}
                </div>
              </div>

              <div className="field">
                <div className="label">Start:</div>
                <div className="value">{formatDate(record.start)}</div>
              </div>

              <div className="field">
                <div className="label">End:</div>
                <div className="value">{formatDate(record.end)}</div>
              </div>
            </div>
          </If>
        </TitledBox>
      </div>
    );
  }
}

const selector = createSelector(
  [
    state => state.userGroupAssessment,
    state => state.user,
    state => state.organization,
  ],
  (userGroupAssessment, user, organization) => ({ userGroupAssessment, user, organization })
);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserGroupAssessmentById,
  clearUserGroupAssessment,
}, dispatch);

export default connect(selector, mapDispatchToProps)(View);
