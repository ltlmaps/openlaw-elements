// @flow

import * as React from 'react';

type Props = {
  executionResult: {},
  onChange: (string, ?string) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  variable: {},
};

type State = {
  currentValue: string,
  validationError: boolean,
};

export class LargeText extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

  state = {
    currentValue: this.props.savedValue,
    validationError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  componentDidUpdate() {
    if (
      !this.state.validationError &&
      this.state.currentValue !== this.props.savedValue
    ) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  onChange(event: SyntheticEvent<*>) {
    const variable = this.props.variable;
    const value = event.currentTarget.value;

    try {
      const name = this.openLaw.getName(variable);

      if (value) {
        this.openLaw.checkValidity(variable, value, this.props.executionResult);

        this.setState({
          validationError: false,
          currentValue: value,
        }, () => {
          const realValue = value === '' ? undefined : value;
          this.props.onChange(name, realValue);
        });
      } else {
        if (this.state.currentValue) {
          this.setState({
            validationError: false,
            currentValue: undefined,
          }, () => {
            this.props.onChange(name, undefined);
          });
        }
      }
    } catch (error) {
      this.setState({
        currentValue: value,
        validationError: true,
      });
    }
  }

  render() {
    const variable = this.props.variable;
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);
    const additionalClassName = this.state.validationError
      ? 'is-danger-new'
      : '';

    return (
      <div className="contract_variable">
        <textarea
          className={`input ${cleanName} ${additionalClassName}`}
          onChange={this.onChange}
          placeholder={description}
          title={description}
          type="text"
          value={this.state.currentValue}
        />
      </div>
    );
  }
}
