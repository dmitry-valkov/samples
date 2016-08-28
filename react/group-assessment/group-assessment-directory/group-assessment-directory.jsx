import './group-assessment-directory.styl';

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  loadUserGroupAssessments,
  clearUserGroupAssessments,
} from 'actions/user-group-assessment-actions';

import { TitledBox } from 'sheri';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import List from '../group-assessment-list/group-assessment-list';
import AsyncView from 'components/async-view/async-view';

class Directory extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static defaultProps = {
    userGroupAssessments: [],
  };

  state = {
    pageTitle: 'Group Assessments',
    loading: true,
  };

  componentDidMount() {
    this.loadUserGroupAssessments();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.organization.id !== this.props.organization.id) {
      setTimeout(() => this.loadUserGroupAssessments(), 0);
    }
  }

  componentWillUnmount() {
    this.props.clearUserGroupAssessments();
  }

  loadUserGroupAssessments = () => {
    const organization = this.props.organization.id;

    return this.props.loadUserGroupAssessments({ organization, populate: ['assessment'] })
      .then(() => this.setState({ loading: false }));
  };

  handleAddNew = () => {
    const slug = this.props.organization.slug;

    this.context.router.push(`/${slug}/group-assessment/new`);
  };

  render() {
    return (
      <div className="group-assessment__directory">
        <Helmet title={this.state.pageTitle}/>

        <TitledBox
          title={this.state.pageTitle}
          style={{ padding: 0 }}
        >
          <AsyncView loading={this.state.loading}>
            <List data={this.props.userGroupAssessments} reload={this.loadUserGroupAssessments}/>
          </AsyncView>
        </TitledBox>

        <If condition={this.props.user.admin}>
          <div className="create-button">
            <FloatingActionButton
              onClick={this.handleAddNew}
              iconClassName="icon-add"
            />
          </div>
        </If>
      </div>
    );
  }
}

const selector = createSelector(
  [
    state => state.user,
    state => state.organization,
    state => state.userGroupAssessments,
  ],
  (user, organization, userGroupAssessments) => ({ user, organization, userGroupAssessments })
);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadUserGroupAssessments,
  clearUserGroupAssessments,
}, dispatch);

export default connect(selector, mapDispatchToProps)(Directory);
