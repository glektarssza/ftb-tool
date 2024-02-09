//-- NPM Packages
import {expect} from 'chai';
import {SinonStub, stub} from 'sinon';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import {BaseError} from '@src/lib/errors/baseError';

//-- Test Utils
import {parseOptionalEnvInteger} from '../../utils';

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('class:lib.errors.BaseError', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "class:lib.errors.BaseError" tests...`
        );
    });
    describe('.constructor()', () => {
        it('should pass the `message` argument to the base class', () => {
            //-- Given
            const message = fake.lorem.sentence();

            //-- When
            const r = new BaseError(message);

            //-- Then
            expect(r.message).to.equal(message);
        });
        it('should pass an empty string to the base class as the `message` argument if none is given', () => {
            //-- Given

            //-- When
            const r = new BaseError();

            //-- Then
            expect(r.message).to.be.empty;
        });
        it('should set the `name` property to the `name` property of the constructor', () => {
            //-- Given
            class TestClass extends BaseError {}

            //-- When
            const r = new TestClass();

            //-- Then
            expect(r.name).to.equal(TestClass.name);
        });
        it('should set the `inner` property to the given value', () => {
            //-- Given
            const inner = new Error();

            //-- When
            const r = new BaseError(undefined, inner);

            //-- Then
            expect(r.inner).to.equal(inner);
        });
        it('should set the `inner` property to `undefined` if no value is given', () => {
            //-- Given

            //-- When
            const r = new BaseError();

            //-- Then
            expect(r.inner).to.be.undefined;
        });
        describe('with `captureStackTrace` available', () => {
            let captureStackTraceStub: SinonStub<
                Parameters<ErrorConstructor['captureStackTrace']>,
                ReturnType<ErrorConstructor['captureStackTrace']>
            >;
            before(() => {
                captureStackTraceStub = stub(Error, 'captureStackTrace');
            });
            beforeEach(() => {
                captureStackTraceStub.reset();

                captureStackTraceStub.throws(new Error('Stubbed function'));
            });
            after(() => {
                captureStackTraceStub.restore();
            });
            it('should call `captureStackTrace` if it is available on the platform', () => {
                //-- Given
                captureStackTraceStub.returns();

                //-- When
                const r = new BaseError();

                //-- Then
                expect(captureStackTraceStub).to.satisfy(() =>
                    captureStackTraceStub.calledOnceWithExactly(r, BaseError)
                );
            });
        });
        describe('without `captureStackTrace` available', () => {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const captureStackTrace = Error.captureStackTrace;
            before(() => {
                Reflect.set(Error, 'captureStackTrace', undefined);
            });
            after(() => {
                Reflect.set(Error, 'captureStackTrace', captureStackTrace);
            });
            it('should not produce an error if `captureStackTrace` is not available', () => {
                //-- Given

                //-- When
                const r = new BaseError();

                //-- Then
                expect(r).to.be.an.instanceOf(BaseError);
            });
        });
    });
});
