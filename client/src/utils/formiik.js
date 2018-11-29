import React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export const ReactstrapInput = ({
  field: { ...fields },
  form: { touched, errors },
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
    />
    {touched[fields.name] && errors[fields.name] ? (
      <FormFeedback>{errors[fields.name]}</FormFeedback>
    ) : (
      ''
    )}
  </FormGroup>
);

export const ReactstrapSelect = ({
  field,
  form: { touched, errors },
  ...props
}) => {
  const error = errors[field.name];
  const touch = touched[field.name];
  return (
    <FormGroup>
      <Label for={field.name} className="label-color">
        {props.label}
      </Label>
      <Input
        {...field}
        {...props}
        type="select"
        invalid={Boolean(touched[field.name] && errors[field.name])}
        placeholder="Test"
      >
        {props.inputprops.placeholder && (
          <option value="">{props.inputprops.placeholder}</option>
        )}
        {props.inputprops.options.map(option => {
          if (option.name)
            return (
              <option value={option.id} key={option.id}>
                {option.name}
              </option>
            );
          return (
            <option value={option} key={option}>
              {option}
            </option>
          );
        })}
      </Input>
      {touch && error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
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
