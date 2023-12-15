//-- NodeJS
import fsp from 'node:fs/promises';

//-- NPM Packages
import chai, {expect} from 'chai';
import {stub} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import testModule from '@src/lib/fs';

//-- Test Utils
import {StubbedProperty} from '../types';
import {parseOptionalEnvInteger} from '../utils';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:lib.fs', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "module:helpers.fs" tests...`
        );
    });
    describe('.exists', () => {
        let accessStub: StubbedProperty<typeof fsp, 'access'>;
        before(() => {
            accessStub = stub(fsp, 'access');
        });
        beforeEach(() => {
            accessStub.reset();

            accessStub.rejects(new Error('Stubbed function'));
        });
        after(() => {
            accessStub.restore();
        });
        it('should return `true` if the given path-like exists on the file system', async () => {
            //-- Given
            const p = fake.system.filePath();
            accessStub.withArgs(p).resolves();

            //-- When
            const r = await testModule.exists(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist on the file system', async () => {
            //-- Given
            const p = fake.system.filePath();
            accessStub.withArgs(p).rejects(new Error('Path does not exist'));

            //-- When
            const r = await testModule.exists(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
});
