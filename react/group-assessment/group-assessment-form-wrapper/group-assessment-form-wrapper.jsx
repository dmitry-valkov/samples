import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getUserGroupAssessmentById,
  createUserGroupAssessment,
  updateUserGroupAssessmentById,
  clearUserGroupAssessment,
} from 'actions/user-group-assessment-actions';

import { clearCurrentForm } from 'actions/current-form-actions';

import { TitledBox } from 'sheri';
import RaisedButton from 'material-ui/RaisedButton';
import AsyncView from 'components/async-view/async-view';
import IconButton from 'material-ui/IconButton';
import View from 'material-ui/svg-icons/image/remove-red-eye';
import Form from '../group-assessment-form/group-assessment-form';

class FormWrapper extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static defaultProps = {
    userGroupAssessment: {},
  };

  state = {
    loading: false,
    pageTitle: 'Create Group Assessment',
  };

  componentWillMount() {
    const id = this.props.params.id;

    if (id) {
      this.state = {
        pageTitle: 'Edit Group Assessment',
        loading: true,
        editMode: true,
        recordId: id,
      };
    }
  }

  componentDidMount() {
    const id = this.props.params.id;

    if (id) {
      this.props.getUserGroupAssessmentById(id, ['assessment'])
        .then(() => this.setState({ loading: false }));
    }
  }

  componentWillUnmount() {
    this.props.clearCurrentForm();
    this.props.clearUserGroupAssessment();
  }

  // Number -> Void
  goToView = (id) => {
    const slug = this.props.organization.slug;

    this.context.router.push(`/${slug}/group-assessment/${id}`);
  };

  createOnClickViewHandler = (id) => () => this.goToView(id);

  handleSaveData = () => {
    const form = this.props.form;
    form.organization = this.props.organization.id;

    const editMode = this.state.editMode;
    let promise = this.props.createUserGroupAssessment(form);

    if (editMode) {
      const id = this.state.recordId;

      promise = this.props.updateUserGroupAssessmentById(id, form);
    }

    promise
      .then(({ payload: { id }, error }) => {
        if (error) return undefined;

        this.goToView(id);
        this.props.clearCurrentForm();
      }).catch(() => this.context.router.back());
  };

  render() {
    let actions = null;

    if (this.state.editMode) {
      actions = (
        <div className="action-buttons">
          <IconButton
            iconStyle={{ fill: '#fff' }}
            tooltip="View"
            onClick={this.createOnClickViewHandler(this.state.recordId)}
          >
            <View />
          </IconButton>
        </div>
      );
    }

    const footerActions = (
      <div className="action-buttons">
        <RaisedButton
          className="action-button"
          primary
          label="Save"
          onClick={this.handleSaveData}
        />
      </div>
    );

    return (
      <div className="group-assessment__form-wrapper">
        <Helmet title={this.state.pageTitle}/>

        <TitledBox
          title={this.state.pageTitle}
          actions={actions}
          footer={footerActions}
        >
          <AsyncView loading={this.state.loading}>
            <Form userGroupAssessment={this.props.userGroupAssessment} />
          </AsyncView>
        </TitledBox>
      </div>
    );
  }
}

const selector = createSelector(
  [
    state => state.userGroupAssessment,
    state => state.currentForm,
    state => state.organization,
  ],
  (userGroupAssessment, form, organization) => ({ userGroupAssessment, form, organization })
);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createUserGroupAssessment,
  getUserGroupAssessmentById,
  updateUserGroupAssessmentById,
  clearUserGroupAssessment,
  clearCurrentForm,
}, dispatch);

export default connect(selector, mapDispatchToProps)(FormWrapper);
