import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsAvatarConfigConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (typeof value !== 'object' || value === null) return false;

    const keys = Object.keys(value);
    const expectedKeys = Object.keys({
      hair: [],
      eyes: [],
      eyebrows: [],
      mouth: [],
      skinColor: [],
      hairColor: [],
      backgroundColor: [],
    });

    // Check if keys match exactly
    if (
      keys.length !== expectedKeys.length ||
      !keys.every((k) => expectedKeys.includes(k))
    ) {
      return false;
    }

    // Check that all values are numbers
    return keys.every((k) => typeof value[k] === 'number');
  }

  defaultMessage(args: ValidationArguments) {
    return `avatarOptions must match the structure of AvatarConfigType, and all values must be numbers.`;
  }
}

export function IsAvatarConfig(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsAvatarConfigConstraint,
    });
  };
}
