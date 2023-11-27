import chai, {expect} from 'chai';
import {stub} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';
import fs from 'node:fs/promises';
import * as fsHelper from '@src/helpers/fs';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:helpers.fs', () => {
    describe('.exists', () => {
        const accessStub = stub(fs, 'access');
        beforeEach(() => {
            accessStub.reset();
            accessStub.callThrough();
        });
        after(() => {
            accessStub.restore();
        });
        it('should call fs.access with the correct arguments', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.exists(path);

            //-- Then
            expect(accessStub).to.have.been.calledOnceWithExactly(
                path,
                fs.constants.F_OK
            );
        });
        it('should return `true` if the file exists on the disk', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub.withArgs(path, fs.constants.F_OK).resolves(undefined);

            //-- When
            const r = await fsHelper.exists(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the file does not exist on the disk', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub
                .withArgs(path, fs.constants.F_OK)
                .rejects(new Error('File does not exist'));

            //-- When
            const r = await fsHelper.exists(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
});
