//-- NPM Packages
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import {ArgumentNilError} from '@src/lib/errors/argumentNilError';

//-- Test Utils
import {parseOptionalEnvInteger} from '../../utils';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:lib.errors.ArgumentNilError', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "module:lib.errors.ArgumentError" tests...`
        );
    });
    describe('.constructor()', () => {
        it('should pass the given message on to the base class', () => {
            //-- Given
            const argumentName = fake.lorem.word();
            const message = fake.lorem.sentence();

            //-- When
            const e = new ArgumentNilError(argumentName, message);

            //-- Then
            expect(e.message).to.equal(message);
        });
        it('should pass a default message on to the base class if none is given', () => {
            //-- Given
            const argumentName = fake.lorem.word();

            //-- When
            const e = new ArgumentNilError(argumentName);

            //-- Then
            expect(e.message).to.equal(
                `Invalid argument "${argumentName}" (null or undefined)`
            );
        });
        it('should pass the given inner error on to the base class', () => {
            //-- Given
            const argumentName = fake.lorem.word();
            const message = fake.lorem.sentence();
            const inner = new Error();

            //-- When
            const e = new ArgumentNilError(argumentName, message, inner);

            //-- Then
            expect(e.inner).to.equal(inner);
        });
        it('should pass the given argument name on to the base class', () => {
            //-- Given
            const argumentName = fake.lorem.word();

            //-- When
            const e = new ArgumentNilError(argumentName);

            //-- Then
            expect(e.argumentName).to.equal(argumentName);
        });
    });
});
