//-- NPM Packages
import {expect} from 'chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import {ArgumentNilError} from '@src/lib/errors/argumentNilError';

//-- Test Utils
import {parseOptionalEnvInteger} from '../../utils';

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:lib.errors', () => {
    describe('class:ArgumentNilError', () => {
        before(() => {
            console.debug(
                `Using "${fake.seed(
                    parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
                )}" as random data seed for "module:helpers.fs" tests...`
            );
        });
        describe('.constructor()', () => {
            it('should pass the `argumentName` argument to the base class', () => {
                //-- Given
                const argumentName = fake.database.column();

                //-- When
                const r = new ArgumentNilError(argumentName);

                //-- Then
                expect(r.argumentName).to.equal(argumentName);
            });
            it('should pass the `message` argument to the base class', () => {
                //-- Given
                const argumentName = fake.database.column();
                const message = fake.lorem.sentence();

                //-- When
                const r = new ArgumentNilError(argumentName, message);

                //-- Then
                expect(r.message).to.equal(message);
            });
            it('should pass a default string to the base class as the `message` argument if none is given', () => {
                //-- Given
                const argumentName = fake.database.column();

                //-- When
                const r = new ArgumentNilError(argumentName);

                //-- Then
                expect(r.message).to.equal(
                    `Invalid argument "${argumentName}" (null or undefined)`
                );
            });
            it('should pass the `inner` argument to the base class', () => {
                //-- Given
                const argumentName = fake.database.column();
                const inner = new Error();

                //-- When
                const r = new ArgumentNilError(argumentName, undefined, inner);

                //-- Then
                expect(r.inner).to.equal(inner);
            });
            it('should pass `undefined` to the because class as the `inner` argument to if none was given', () => {
                //-- Given
                const argumentName = fake.database.column();

                //-- When
                const r = new ArgumentNilError(argumentName);

                //-- Then
                expect(r.inner).to.be.undefined;
            });
        });
    });
});
