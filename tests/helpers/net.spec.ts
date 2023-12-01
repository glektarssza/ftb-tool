//-- NodeJS

//-- NPM Packages
import chai from 'chai';
import {} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code

//-- Test Utils
import {parseOptionalEnvInteger} from '../utils';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:helpers.fs', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "module:helpers.net" tests...`
        );
    });
});
