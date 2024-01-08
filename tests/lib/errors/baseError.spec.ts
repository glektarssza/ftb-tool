//-- NPM Packages
import chai, {expect} from 'chai';
import {SinonStub, stub} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import {BaseError} from '@src/lib/errors/baseError';

//-- Test Utils
import {parseOptionalEnvInteger} from '../../utils';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:lib.errors.BaseError', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "module:lib.errors.BaseError" tests...`
        );
    });
    describe('.constructor()', () => {
        let captureStackTraceStub: SinonStub<
            Parameters<typeof Error.captureStackTrace>,
            ReturnType<typeof Error.captureStackTrace>
        >;
        before(() => {
            captureStackTraceStub = stub(Error, 'captureStackTrace');
        });
        beforeEach(() => {
            captureStackTraceStub.reset();

            captureStackTraceStub.callThrough();
        });
        after(() => {
            captureStackTraceStub.restore();
        });
        it('should pass the given message on to the base class', () => {
            //-- Given
            const message = fake.lorem.sentence();

            //-- When
            const e = new BaseError(message);

            //-- Then
            expect(e.message).to.equal(message);
        });
        it('should set the `inner` property to the given value', () => {
            //-- Given
            const inner = new Error();

            //-- When
            const e = new BaseError(undefined, inner);

            //-- Then
            expect(e.inner).to.equal(inner);
        });
        it('should set the `inner` property to `undefined` if no value is given', () => {
            //-- Given

            //-- When
            const e = new BaseError();

            //-- Then
            expect(e.inner).to.be.undefined;
        });
        it('set the `name` property to the name of the constructor', () => {
            //-- Given

            //-- When
            const e = new BaseError();

            //-- Then
            expect(e.name).to.equal('BaseError');
        });
        it('should call `captureStackTrace` if it is available', () => {
            //-- Given
            captureStackTraceStub.returns(undefined);

            //-- When
            const e = new BaseError();

            //-- Then
            expect(captureStackTraceStub).to.have.been.calledOnceWithExactly(
                e,
                e.constructor
            );
        });
        it('should not call `captureStackTrace` if it is not available', () => {
            //-- Given
            captureStackTraceStub.value(undefined);

            //-- When
            new BaseError();

            //-- Then
            expect(captureStackTraceStub).to.not.have.been.called;
        });
    });
});
