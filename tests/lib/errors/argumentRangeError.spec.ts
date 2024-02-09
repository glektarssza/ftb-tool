//-- NPM Packages
import {expect} from 'chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import {ArgumentRangeError} from '@src/lib/errors/argumentRangeError';

//-- Test Utils
import {parseOptionalEnvInteger} from '../../utils';

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('class:lib.errors.ArgumentRangeError', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "class:lib.errors.ArgumentRangeError" tests...`
        );
    });
    describe('.constructor()', () => {
        it('should set the `actualValue` property to the given value', () => {
            //-- Given
            const actualValue = fake.number.int({
                min: 10,
                max: 20
            });
            const minimumValue = fake.number.int({
                max: actualValue - 1
            });
            const maximumValue = fake.number.int({
                min: actualValue + 1,
                max: 100
            });
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentRangeError(
                actualValue,
                minimumValue,
                maximumValue,
                argumentName
            );

            //-- Then
            expect(r.actualValue).to.equal(actualValue);
        });
        it('should set the `minimumValue` property to the given value', () => {
            //-- Given
            const actualValue = fake.number.int({
                min: 10,
                max: 20
            });
            const minimumValue = fake.number.int({
                max: actualValue - 1
            });
            const maximumValue = fake.number.int({
                min: actualValue + 1,
                max: 100
            });
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentRangeError(
                actualValue,
                minimumValue,
                maximumValue,
                argumentName
            );

            //-- Then
            expect(r.minimumValue).to.equal(minimumValue);
        });
        it('should set the `maximumValue` property to the given value', () => {
            //-- Given
            const actualValue = fake.number.int({
                min: 10,
                max: 20
            });
            const minimumValue = fake.number.int({
                max: actualValue - 1
            });
            const maximumValue = fake.number.int({
                min: actualValue + 1,
                max: 100
            });
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentRangeError(
                actualValue,
                minimumValue,
                maximumValue,
                argumentName
            );

            //-- Then
            expect(r.maximumValue).to.equal(maximumValue);
        });
        it('should pass the `argumentName` argument to the base class', () => {
            //-- Given
            const actualValue = fake.number.int({
                min: 10,
                max: 20
            });
            const minimumValue = fake.number.int({
                max: actualValue - 1
            });
            const maximumValue = fake.number.int({
                min: actualValue + 1,
                max: 100
            });
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentRangeError(
                actualValue,
                minimumValue,
                maximumValue,
                argumentName
            );

            //-- Then
            expect(r.argumentName).to.equal(argumentName);
        });
        it('should pass the `message` argument to the base class', () => {
            //-- Given
            const actualValue = fake.number.int({
                min: 10,
                max: 20
            });
            const minimumValue = fake.number.int({
                max: actualValue - 1
            });
            const maximumValue = fake.number.int({
                min: actualValue + 1,
                max: 100
            });
            const argumentName = fake.database.column();
            const message = fake.lorem.sentence();

            //-- When
            const r = new ArgumentRangeError(
                actualValue,
                minimumValue,
                maximumValue,
                argumentName,
                message
            );

            //-- Then
            expect(r.message).to.equal(message);
        });
        it('should pass a default string to the base class as the `message` argument if none is given', () => {
            //-- Given
            const actualValue = fake.number.int({
                min: 10,
                max: 20
            });
            const minimumValue = fake.number.int({
                max: actualValue - 1
            });
            const maximumValue = fake.number.int({
                min: actualValue + 1,
                max: 100
            });
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentRangeError(
                actualValue,
                minimumValue,
                maximumValue,
                argumentName
            );

            //-- Then
            expect(r.message).to.equal(
                `Invalid argument "${argumentName}" (value "${actualValue}" outside allowed range of "${minimumValue}" to "${maximumValue}")`
            );
        });
        it('should pass the `inner` argument to the base class', () => {
            //-- Given
            const actualValue = fake.number.int({
                min: 10,
                max: 20
            });
            const minimumValue = fake.number.int({
                max: actualValue - 1
            });
            const maximumValue = fake.number.int({
                min: actualValue + 1,
                max: 100
            });
            const argumentName = fake.database.column();
            const inner = new Error();

            //-- When
            const r = new ArgumentRangeError(
                actualValue,
                minimumValue,
                maximumValue,
                argumentName,
                undefined,
                inner
            );

            //-- Then
            expect(r.inner).to.equal(inner);
        });
        it('should pass `undefined` to the because class as the `inner` argument to if none was given', () => {
            //-- Given
            const actualValue = fake.number.int({
                min: 10,
                max: 20
            });
            const minimumValue = fake.number.int({
                max: actualValue - 1
            });
            const maximumValue = fake.number.int({
                min: actualValue + 1,
                max: 100
            });
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentRangeError(
                actualValue,
                minimumValue,
                maximumValue,
                argumentName
            );

            //-- Then
            expect(r.inner).to.be.undefined;
        });
    });
});
