import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';

export const ReactstrapInput = ({
  field: { ...fields },
  form: { isSubmitting, touched, errors },
  ...props
}) => (
  <FormGroup>
    <Label for={fields.name} className="label-color">
      {props.label}
    </Label>
    <Input
      {...props}
      {...fields}
      invalid={Boolean(touched[fields.name] && errors[fields.name])}
      disabled={isSubmitting || props.disabled}
    />
    {touched[fields.name] && errors[fields.name] ? (
      <FormFeedback>{errors[fields.name]}</FormFeedback>
    ) : (
      ''
    )}
  </FormGroup>
);
ReactstrapInput.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export const ReactstrapSelect = ({
  field: { ...fields },
  form: { setFieldTouched, setFieldValue, touched, errors, isSubmitting },
  ...props
}) => {
  const error = errors[fields.name];
  const touch = touched[fields.name];

  return (
    <FormGroup>
      <Label for={fields.name} className="label-color">
        {props.label}
      </Label>
      <Select
        {...props}
        {...fields}
        styles={{
          control: provided => ({
            ...provided,
            borderColor: touch && error ? '#dc3545' : provided.borderColor,
          }),
        }}
        value={typeof props.value === 'object' ? props.value : null}
        onChange={value => setFieldValue(fields.name, value)}
        onBlur={() => {
          setFieldTouched(fields.name, true);
        }}
        isDisabled={isSubmitting || props.disabled}
      />
      {touch && error && (
        <p
          className="text-danger"
          style={{
            width: '100%',
            marginTop: '0.25rem',
            fontSize: '80%',
          }}
        >
          {error}
        </p>
      )}
    </FormGroup>
  );
};
ReactstrapSelect.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.object,
  disabled: PropTypes.bool,
};

export const ReactstrapCheckbox = ({
  field: { ...fields },
  form: { isSubmitting, touched, errors },
  ...props
}) => (
  <FormGroup check>
    <Label className="label-color" check>
      <Input
        {...props}
        {...fields}
        checked={fields.value}
        invalid={Boolean(touched[fields.name] && errors[fields.name])}
        disabled={isSubmitting}
      />
      {props.label}
    </Label>
    {touched[fields.name] && errors[fields.name] ? (
      <FormFeedback>{errors[fields.name]}</FormFeedback>
    ) : (
      ''
    )}
  </FormGroup>
);
ReactstrapCheckbox.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
  label: PropTypes.string,
};

/* export const ReactstrapRadioInput = ({
  field: { name, value },
  form: { setFieldValue, values },
  disabled = false,
  label,
  ...props
}) => (
  <FormGroup check inline>
    <Label for="inp">
      <Input
        type="radio"
        name={field.name}
        checked={values[field.name] === field.value}
        value={field.value}
        onChange={(event, value) => setFieldValue(field.name, field.value)}
      />
      {label}
    </Label>
  </FormGroup>
); */
