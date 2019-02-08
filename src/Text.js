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

export class Text extends React.Component<Props, State> {
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

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const variable = this.props.variable;
    const eventValue = event.currentTarget.value;

    try {
      const name = this.openLaw.getName(variable);

      if (eventValue) {
        this.openLaw.checkValidity(variable, eventValue, this.props.executionResult);

        this.setState({
          currentValue: eventValue,
          validationError: false,
        }, () => {
          const realValue = eventValue === '' ? undefined : eventValue;
          this.props.onChange(name, realValue);
        });
      } else {
        if (this.state.currentValue) {
          this.setState({
            currentValue: undefined,
            validationError: false,
          }, () => {
            this.props.onChange(name, undefined);
          });
        }
      }
    } catch (error) {
      this.setState({
        currentValue: eventValue,
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
        <input
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
