//-- NPM Packages
import {expect} from 'chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import {ArgumentChoicesError} from '@src/lib/errors/argumentChoicesError';

//-- Test Utils
import {parseOptionalEnvInteger} from '../../utils';

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('class:lib.errors.ArgumentChoicesError', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "class:lib.errors.ArgumentChoicesError" tests...`
        );
    });
    describe('.constructor()', () => {
        it('should set the `actualValue` property to the given value', () => {
            //-- Given
            const choices = fake.helpers.uniqueArray(
                () => fake.color.human(),
                5
            );
            let actualValue;
            do {
                actualValue = fake.color.human();
            } while (choices.includes(actualValue));
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentChoicesError(
                actualValue,
                choices,
                argumentName
            );

            //-- Then
            expect(r.actualValue).to.equal(actualValue);
        });
        it('should set the `argumentChoices` property to the given value', () => {
            //-- Given
            const choices = fake.helpers.uniqueArray(
                () => fake.color.human(),
                5
            );
            let actualValue;
            do {
                actualValue = fake.color.human();
            } while (choices.includes(actualValue));
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentChoicesError(
                actualValue,
                choices,
                argumentName
            );

            //-- Then
            expect(r.argumentChoices).to.include.all.members(choices);
        });
        it('should pass the `argumentName` argument to the base class', () => {
            //-- Given
            const choices = fake.helpers.uniqueArray(
                () => fake.color.human(),
                5
            );
            let actualValue;
            do {
                actualValue = fake.color.human();
            } while (choices.includes(actualValue));
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentChoicesError(
                actualValue,
                choices,
                argumentName
            );

            //-- Then
            expect(r.argumentName).to.equal(argumentName);
        });
        it('should pass the `message` argument to the base class', () => {
            //-- Given
            const choices = fake.helpers.uniqueArray(
                () => fake.color.human(),
                5
            );
            let actualValue;
            do {
                actualValue = fake.color.human();
            } while (choices.includes(actualValue));
            const argumentName = fake.database.column();
            const message = fake.lorem.sentence();

            //-- When
            const r = new ArgumentChoicesError(
                actualValue,
                choices,
                argumentName,
                message
            );

            //-- Then
            expect(r.message).to.equal(message);
        });
        it('should pass a default string to the base class as the `message` argument if none is given', () => {
            //-- Given
            const choices = fake.helpers.uniqueArray(
                () => fake.color.human(),
                5
            );
            let actualValue;
            do {
                actualValue = fake.color.human();
            } while (choices.includes(actualValue));
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentChoicesError(
                actualValue,
                choices,
                argumentName
            );

            //-- Then
            expect(r.message).to.equal(
                `Invalid argument "${argumentName}" (value "${actualValue}" not one of "[${choices.join(
                    ', '
                )}]")`
            );
        });
        it('should pass the `inner` argument to the base class', () => {
            //-- Given
            const choices = fake.helpers.uniqueArray(
                () => fake.color.human(),
                5
            );
            let actualValue;
            do {
                actualValue = fake.color.human();
            } while (choices.includes(actualValue));
            const argumentName = fake.database.column();
            const inner = new Error();

            //-- When
            const r = new ArgumentChoicesError(
                actualValue,
                choices,
                argumentName,
                undefined,
                inner
            );

            //-- Then
            expect(r.inner).to.equal(inner);
        });
        it('should pass `undefined` to the because class as the `inner` argument to if none was given', () => {
            //-- Given
            const choices = fake.helpers.uniqueArray(
                () => fake.color.human(),
                5
            );
            let actualValue;
            do {
                actualValue = fake.color.human();
            } while (choices.includes(actualValue));
            const argumentName = fake.database.column();

            //-- When
            const r = new ArgumentChoicesError(
                actualValue,
                choices,
                argumentName
            );

            //-- Then
            expect(r.inner).to.be.undefined;
        });
    });
});
