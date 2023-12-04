//-- NPM Packages
import chai, {expect} from 'chai';
import {} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import helpers from '@src/helpers/index';

//-- Test Utils
import {parseOptionalEnvInteger} from '../utils';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:helpers.index', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "module:helpers.net" tests...`
        );
    });
    describe('.isNull', () => {
        it('should return `true` if the value is `null`', () => {
            //-- Given
            const value = null;

            //-- When
            const r = helpers.isNull(value);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the value is not `null`', () => {
            //-- Given
            const values = [
                undefined,
                42,
                false,
                new RegExp(''),
                {},
                []
            ] as unknown[];

            //-- When
            const r = values
                .map((value) => helpers.isNull(value))
                .reduce((accum, result) => accum || result, false);

            //-- Then
            expect(r).to.not.be.true;
        });
    });
    describe('.isUndefined', () => {
        it('should return `true` if the value is `undefined`', () => {
            //-- Given
            const value = undefined;

            //-- When
            const r = helpers.isUndefined(value);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the value is not `undefined`', () => {
            //-- Given
            const values = [
                null,
                42,
                false,
                new RegExp(''),
                {},
                []
            ] as unknown[];

            //-- When
            const r = values
                .map((value) => helpers.isUndefined(value))
                .reduce((accum, result) => accum || result, false);

            //-- Then
            expect(r).to.not.be.true;
        });
    });
    describe('.isNil', () => {
        it('should return `true` if the value is `null`', () => {
            //-- Given
            const value = null;

            //-- When
            const r = helpers.isNil(value);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `true` if the value is `undefined`', () => {
            //-- Given
            const value = undefined;

            //-- When
            const r = helpers.isNil(value);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the value is not `null` or `undefined`', () => {
            //-- Given
            const values = [42, false, new RegExp(''), {}, []] as unknown[];

            //-- When
            const r = values
                .map((value) => helpers.isNil(value))
                .reduce((accum, result) => accum || result, false);

            //-- Then
            expect(r).to.not.be.true;
        });
    });
});
