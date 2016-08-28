import './group-assessment-form.styl';

import React, { Component } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getAssessments,
  getPersonalityTypes,
} from 'services/optionLoaders';

import { updateCurrentForm, clearCurrentForm } from 'actions/current-form-actions';

import Select from 'react-select';
import DateTimePicker from 'components/date-time-picker/date-time-picker';

const Async = Select.Async;

class Form extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  state = {
    assessment: undefined,
    personalityTypes: undefined,
    start: undefined,
    end: undefined,
  };

  componentWillMount() {
    const record = this.props.userGroupAssessment;

    if (record.id) {
      this.setState({
        assessment: {
          label: record.assessment.title,
          value: record.assessment.id,
        },
        personalityTypes: record.personalityTypes.map((type) => ({ label: type, value: type })),
        start: record.start,
        end: record.end,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearCurrentForm();
  }

  // String -> Any -> Void
  createAsyncOnChangeHandler = (name) => (value) => {
    const clearValue = Array.isArray(value) && !value.length ? null : value;

    this.setState({ [name]: clearValue });
    this.props.updateCurrentForm({ [name]: clearValue.value });
  };

  // Array = [] -> Void
  handlePersonalityTypesChange = (personalityTypes = []) => {
    this.setState({ personalityTypes });

    const fomattedData = personalityTypes ? personalityTypes.map((obj) => obj.label) : null;
    this.props.updateCurrentForm({ personalityTypes: fomattedData });
  };

  // String -> (Date) -> Void
  createDatetimeOnChangeHandler = (name) => (value) => {
    this.setState({ [name]: value });
    this.props.updateCurrentForm({ [name]: value });
  };

  render() {
    return (
      <div className="group-assessment__form">
        <div className="form-field">
          <div className="label">Assessment</div>

          <Async
            loadOptions={getAssessments}
            value={this.state.assessment}
            placeholder="Select Assessment"
            onChange={this.createAsyncOnChangeHandler('assessment')}
          />
        </div>

        <div className="form-field">
          <div className="label">Personality Type</div>

          <Async
            multi
            loadOptions={getPersonalityTypes}
            value={this.state.personalityTypes}
            placeholder="Select Personality Types"
            onChange={this.handlePersonalityTypesChange}
          />
        </div>

        <div className="form-field">
          <div className="label">Datetime From</div>

          <div className="field">
            <DateTimePicker
              onChange={this.createDatetimeOnChangeHandler('start')}
              style={{ marginTop: 15, width: '100%' }}
              placeholder="Start date"
              value={this.state.start}
            />
          </div>
        </div>

        <div className="form-field">
          <div className="label">Datetime To</div>

          <div className="field">
            <DateTimePicker
              onChange={this.createDatetimeOnChangeHandler('end')}
              style={{ marginTop: 15, width: '100%' }}
              placeholder="End date"
              value={this.state.end}
            />
          </div>
        </div>
      </div>
    );
  }
}

const selector = createSelector(
  [],
  () => ({})
);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateCurrentForm,
  clearCurrentForm,
}, dispatch);

export default connect(selector, mapDispatchToProps)(Form);
