import React from "react";
import { Input, InputWrapper } from "@mantine/core";
import { GenericFieldProps } from "utils/forms";
import NumberFormat from "react-number-format";

const CustomNumberInput: React.FC<any> = (inputProps) => {
    return <Input  {...inputProps} type="tel" />;
};

const NumberField: React.FC<GenericFieldProps> = ({ id, name, label, onChange, onBlur, value, error, required, description, classNames }) => {

    return (
        <InputWrapper
            id={id}
            label={label}
            onBlur={onBlur}
            error={error}
            required={required}
            description={description}
            classNames={classNames}
        >
            <NumberFormat
                id={id}
                name={name}
                value={value}
                type="tel"
                onValueChange={(values)=>onChange(values.formattedValue)}
                format="(###) ###-####"
                mask="_"
                allowEmptyFormatting={true}
                customInput={CustomNumberInput}
            />
        </InputWrapper>
    )

}

export default NumberField;