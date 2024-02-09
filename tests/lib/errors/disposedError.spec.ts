//-- NPM Packages
import {expect} from 'chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import {DisposedError} from '@src/lib/errors/disposedError';

//-- Test Utils
import {parseOptionalEnvInteger} from '../../utils';

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('class:lib.errors.DisposedError', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "class:lib.errors.DisposedError" tests...`
        );
    });
    describe('.constructor()', () => {
        it('should set the `objectType` property to the given value', () => {
            //-- Given
            const objectType = fake.database.column();
            const operationName = fake.database.column();

            //-- When
            const r = new DisposedError(objectType, operationName);

            //-- Then
            expect(r.objectType).to.equal(objectType);
        });
        it('should pass the `operationName` argument to the base class', () => {
            //-- Given
            const objectType = fake.database.column();
            const operationName = fake.database.column();

            //-- When
            const r = new DisposedError(objectType, operationName);

            //-- Then
            expect(r.operationName).to.equal(operationName);
        });
        it('should pass the `message` argument to the base class', () => {
            //-- Given
            const objectType = fake.database.column();
            const operationName = fake.database.column();
            const message = fake.lorem.sentence();

            //-- When
            const r = new DisposedError(objectType, operationName, message);

            //-- Then
            expect(r.message).to.equal(message);
        });
        it('should pass a default string to the base class as the `message` argument if none is given', () => {
            //-- Given
            const objectType = fake.database.column();
            const operationName = fake.database.column();

            //-- When
            const r = new DisposedError(objectType, operationName);

            //-- Then
            expect(r.message).to.equal(
                `Operation "${operationName}" failed (object of type "${objectType}" has been disposed)`
            );
        });
        it('should pass the `inner` argument to the base class', () => {
            //-- Given
            const objectType = fake.database.column();
            const operationName = fake.database.column();
            const inner = new Error();

            //-- When
            const r = new DisposedError(
                objectType,
                operationName,
                undefined,
                inner
            );

            //-- Then
            expect(r.inner).to.equal(inner);
        });
        it('should pass `undefined` to the because class as the `inner` argument to if none was given', () => {
            //-- Given
            const objectType = fake.database.column();
            const operationName = fake.database.column();

            //-- When
            const r = new DisposedError(objectType, operationName);

            //-- Then
            expect(r.inner).to.be.undefined;
        });
    });
});
